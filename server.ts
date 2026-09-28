import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI SDK for server-side processing
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to sanitize HTML tags
function stripHtmlTags(html: string): string {
  return html
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<svg\b[^<]*>([\s\S]*?)<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Endpoint to scrape and structure news article from a given URL or text
app.post('/api/scrape-article', async (req, res) => {
  try {
    const { url, rawText } = req.body;

    if ((!url || typeof url !== 'string' || !url.startsWith('http')) && !rawText) {
      return res.status(400).json({ 
        error: 'Por favor, informe um URL de notícia válido (iniciando com http:// ou https://) ou cole o texto da matéria.' 
      });
    }

    let pageHtml = '';
    let pageTitle = '';
    let pageOgImage = '';
    let pageOgDescription = '';

    if (url) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
          },
          redirect: 'follow',
        });

        if (response.ok) {
          pageHtml = await response.text();

          // OpenGraph & meta tags
          const ogTitleMatch = pageHtml.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                               pageHtml.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i) ||
                               pageHtml.match(/<title>([^<]+)<\/title>/i);
          if (ogTitleMatch) pageTitle = ogTitleMatch[1];

          const ogImgMatch = pageHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                             pageHtml.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
          if (ogImgMatch) pageOgImage = ogImgMatch[1];

          const ogDescMatch = pageHtml.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                              pageHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
          if (ogDescMatch) pageOgDescription = ogDescMatch[1];
        }
      } catch (fetchErr) {
        console.warn('Direct fetch notice (will rely on Gemini analysis/search):', fetchErr);
      }
    }

    const cleanTextSample = rawText || stripHtmlTags(pageHtml).slice(0, 15000);

    const promptText = `Você é um editor jornalístico sênior do portal "Brasil & Interior".
Analise o seguinte conteúdo para extrair e estruturar uma reportagem jornalística completa:
${url ? `URL da notícia: ${url}` : ''}
${pageTitle ? `Título preliminar: ${pageTitle}` : ''}
${pageOgDescription ? `Resumo preliminar: ${pageOgDescription}` : ''}
${pageOgImage ? `Imagem preliminar: ${pageOgImage}` : ''}

Amostra / Conteúdo do texto:
"""
${cleanTextSample || 'Se a amostra estiver vazia, pesquise o assunto da URL informada e recrie a matéria.'}
"""

Monte uma matéria jornalística perfeita em português no formato JSON com as chaves:
- title: Título jornalístico atraente e impactante.
- subtitle: Subtítulo (linha fina) esclarecedor de 1 a 2 frases.
- content: O corpo completo da reportagem, bem estruturado em parágrafos coerentes.
- coverImage: URL de imagem válida de capa (prefira "${pageOgImage}" se existente, ou URL temática do Unsplash).
- category: Escolha EXATAMENTE uma destas categorias: "Geral", "Nacional", "Economia", "Agronegócio", "Política", "Cidades", "Meio Ambiente", "Cultura", "Tecnologia".
- scope: Escolha EXATAMENTE uma destas opções: "Nacional", "Estadual", "Municipal".
- stateSigla: Sigla do estado brasileiro citado (ex: "SP", "MT", "MG", "PR", "BA"), ou string vazia.
- cityName: Nome da cidade/município citado se houver, ou string vazia.
- tags: Array de 3 a 5 palavras-chave relevantes.
- authorName: Nome do veículo/repórter original ou "Redação Brasil & Interior".
`;

    let parsedJson: any = {};

    try {
      // Call Gemini 2.5 Flash
      const geminiResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { type: Type.STRING },
              coverImage: { type: Type.STRING },
              category: { type: Type.STRING },
              scope: { type: Type.STRING },
              stateSigla: { type: Type.STRING },
              cityName: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              authorName: { type: Type.STRING },
            },
            required: ['title', 'subtitle', 'content', 'category', 'scope'],
          },
        },
      });

      if (geminiResult && geminiResult.text) {
        parsedJson = JSON.parse(geminiResult.text);
      }
    } catch (geminiErr) {
      console.warn('First gemini attempt notice, retrying without strict schema:', geminiErr);
      // Fallback call without responseSchema if schema validation fails
      const fallbackResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText + '\n\nResponda APENAS em JSON válido sem marcações markdown.',
      });
      const rawRes = fallbackResult.text || '';
      const cleanJsonStr = rawRes.replace(/```json/gi, '').replace(/```/g, '').trim();
      try {
        parsedJson = JSON.parse(cleanJsonStr);
      } catch (e) {
        console.error('JSON parse fallback error:', e);
      }
    }

    // Ensure fallback defaults if needed
    const finalTitle = parsedJson.title || pageTitle || 'Reportagem Importada';
    const finalSubtitle = parsedJson.subtitle || pageOgDescription || 'Confira os detalhes desta matéria no portal.';
    const finalContent = parsedJson.content || cleanTextSample || 'Conteúdo da reportagem importado do portal.';
    const finalCover = parsedJson.coverImage && parsedJson.coverImage.startsWith('http')
      ? parsedJson.coverImage
      : pageOgImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';

    return res.json({
      success: true,
      article: {
        title: finalTitle,
        subtitle: finalSubtitle,
        content: finalContent,
        coverImage: finalCover,
        category: parsedJson.category || 'Geral',
        scope: parsedJson.scope || 'Municipal',
        stateSigla: parsedJson.stateSigla || 'SP',
        cityName: parsedJson.cityName || 'Campinas',
        tags: parsedJson.tags && Array.isArray(parsedJson.tags) && parsedJson.tags.length > 0 
          ? parsedJson.tags 
          : ['Brasil', 'Interior', 'Notícias'],
        authorName: parsedJson.authorName || 'Correspondente / Fonte Externa',
        sourceUrl: url || '',
      },
    });

  } catch (err: any) {
    console.error('Error in /api/scrape-article:', err);
    return res.status(500).json({ 
      error: 'Não foi possível extrair a matéria automaticamente deste link. Tente outro link ou cole o texto da matéria.' 
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        let template = await vite.transformIndexHtml(url, `<!DOCTYPE html><html><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
