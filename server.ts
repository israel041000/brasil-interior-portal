import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI SDK with server-side API Key
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

// Endpoint to scrape & structure news article using Gemini 2.5 Flash + Google Search Grounding
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
        console.warn('Direct fetch notice (will rely on Google Search Grounding):', fetchErr);
      }
    }

    const cleanTextSample = rawText || stripHtmlTags(pageHtml).slice(0, 15000);

    const promptText = `Você é um editor jornalístico sênior do portal "Brasil & Interior".
Sua tarefa é pesquisar na web via Google e extrair/estruturar uma matéria jornalística completa em português a partir das seguintes informações:
${url ? `URL da matéria: ${url}` : ''}
${pageTitle ? `Título de referência: ${pageTitle}` : ''}
${pageOgDescription ? `Resumo de referência: ${pageOgDescription}` : ''}
${cleanTextSample ? `Texto extraído prévio: ${cleanTextSample}` : ''}

IMPORTANTE: Use o Google Search Grounding para consultar os dados da notícia dessa URL no Google se necessário.
Responda APENAS um código JSON válido e completo (sem textos explicativos antes ou depois), com as chaves:
{
  "title": "Título jornalístico atraente e completo",
  "subtitle": "Resumo ou linha fina de 1 a 2 frases claras",
  "content": "O corpo completo da reportagem organizado em parágrafos coerentes",
  "coverImage": "URL de imagem de capa válida (use '${pageOgImage}' se disponível, ou uma imagem temática do Unsplash)",
  "category": "Escolha EXATAMENTE uma destas categorias: Geral, Nacional, Economia, Agronegócio, Política, Cidades, Meio Ambiente, Cultura, Tecnologia",
  "scope": "Escolha EXATAMENTE uma destas opções: Nacional, Estadual, Municipal",
  "stateSigla": "Sigla de 2 letras do Estado brasileiro citado (ex: SP, MT, MG) ou string vazia",
  "cityName": "Nome do município/cidade citado se houver, ou string vazia",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "authorName": "Nome do veículo original ou Redação Brasil & Interior"
}`;

    let parsedJson: any = {};

    try {
      // Call Gemini 2.5 Flash with Google Search Grounding
      const geminiResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawTextResponse = geminiResult.text || '';
      // Clean JSON formatting fence if present
      const cleanedText = rawTextResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      // Find first '{' and last '}'
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace > firstBrace) {
        const jsonSub = cleanedText.slice(firstBrace, lastBrace + 1);
        parsedJson = JSON.parse(jsonSub);
      } else {
        parsedJson = JSON.parse(cleanedText);
      }
    } catch (geminiErr) {
      console.warn('Google Search Grounding attempt warning:', geminiErr);
      
      // Fallback: simple prompt without tool
      try {
        const fallbackResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
        });
        const rawRes = fallbackResult.text || '';
        const cleanedFallback = rawRes.replace(/```json/gi, '').replace(/```/g, '').trim();
        const fBrace = cleanedFallback.indexOf('{');
        const lBrace = cleanedFallback.lastIndexOf('}');
        if (fBrace !== -1 && lBrace > fBrace) {
          parsedJson = JSON.parse(cleanedFallback.slice(fBrace, lBrace + 1));
        }
      } catch (e2) {
        console.error('Fallback JSON parse error:', e2);
      }
    }

    // Fallbacks if properties are missing
    const finalTitle = parsedJson.title || pageTitle || 'Reportagem Importada';
    const finalSubtitle = parsedJson.subtitle || pageOgDescription || 'Confira os detalhes desta matéria no portal.';
    const finalContent = parsedJson.content || cleanTextSample || 'Conteúdo da reportagem importado para o portal.';
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
      error: 'Não foi possível extrair a matéria automaticamente. Tente novamente ou cole o texto da matéria.' 
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
