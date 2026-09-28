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

// Endpoint to scrape and structure news article from a given URL
app.post('/api/scrape-article', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ 
        error: 'Por favor, informe um URL válido iniciando com http:// ou https://' 
      });
    }

    let pageHtml = '';
    let pageTitle = '';
    let pageOgImage = '';
    let pageOgDescription = '';

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        redirect: 'follow',
      });

      if (response.ok) {
        pageHtml = await response.text();

        // Basic meta extraction
        const ogTitleMatch = pageHtml.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                             pageHtml.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i);
        if (ogTitleMatch) pageTitle = ogTitleMatch[1];

        const ogImgMatch = pageHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                           pageHtml.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
        if (ogImgMatch) pageOgImage = ogImgMatch[1];

        const ogDescMatch = pageHtml.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                            pageHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (ogDescMatch) pageOgDescription = ogDescMatch[1];
      }
    } catch (fetchErr) {
      console.warn('Scraping fetch warning:', fetchErr);
    }

    const cleanTextSample = stripHtmlTags(pageHtml).slice(0, 12000);

    const promptText = `Você é um editor jornalístico profissional do portal "Brasil & Interior".
Analise o conteúdo e metadados extraídos do seguinte link de notícia:
URL: ${url}
Título prévio: ${pageTitle}
Descrição prévia: ${pageOgDescription}
Imagem prévia: ${pageOgImage}

Amostra do texto da página:
"""
${cleanTextSample || 'Não foi possível extrair HTML direto. Por favor, infira sobre o link/assunto.'}
"""

Sua tarefa é organizar e estruturar esta matéria em português para publicação no portal.
Retorne um objeto JSON estrito no seguinte formato:
- title: Título jornalístico atraente e completo.
- subtitle: Resumo ou linha fina de 1 a 2 frases claras.
- content: O corpo completo da reportagem organizado em parágrafos.
- coverImage: URL da imagem de capa (use "${pageOgImage}" se for válida, ou uma URL no Unsplash temática se vazia).
- category: Uma destas opções exatas: ["Geral", "Nacional", "Economia", "Agronegócio", "Política", "Cidades", "Meio Ambiente", "Cultura", "Tecnologia"].
- scope: Uma destas opções exatas: ["Nacional", "Estadual", "Municipal"].
- stateSigla: A sigla de 2 letras do Estado brasileiro citado (ex: "SP", "MT", "MG", "BA"), ou string vazia se for estritamente nacional.
- cityName: O nome do município/cidade citado na matéria se houver, ou string vazia.
- tags: Array de 3 a 5 palavras-chave relevantes.
- authorName: Nome do veículo/repórter original (ex: "Redação / Agência de Notícias").
`;

    // Call Gemini API to extract structured fields
    const geminiResult = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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

    const parsedJson = JSON.parse(geminiResult.text || '{}');

    // Return structured article object to client
    return res.json({
      success: true,
      article: {
        title: parsedJson.title || pageTitle || 'Notícia Importada',
        subtitle: parsedJson.subtitle || pageOgDescription || '',
        content: parsedJson.content || cleanTextSample || '',
        coverImage: parsedJson.coverImage || pageOgImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        category: parsedJson.category || 'Geral',
        scope: parsedJson.scope || 'Municipal',
        stateSigla: parsedJson.stateSigla || 'SP',
        cityName: parsedJson.cityName || 'Campinas',
        tags: parsedJson.tags && parsedJson.tags.length > 0 ? parsedJson.tags : ['Brasil', 'Interior', 'Notícias'],
        authorName: parsedJson.authorName || 'Correspondente / Fonte Externa',
        sourceUrl: url,
      },
    });

  } catch (err: any) {
    console.error('Error in /api/scrape-article:', err);
    return res.status(500).json({ 
      error: 'Não foi possível extrair a matéria deste link. Verifique se o endereço está correto e acessível.' 
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
