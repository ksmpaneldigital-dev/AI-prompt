import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { aiSongwriterService } from './server/aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health and AI status check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    apiKeyConfigured: aiSongwriterService.isConfigured(),
    provider: aiSongwriterService.isConfigured() ? 'gemini' : 'demo',
    model: 'gemini-3.8-flash',
    version: '1.0.0',
    mode: aiSongwriterService.isConfigured() ? 'live_ai' : 'demo_mode',
  });
});

// Analyze prompt endpoint
app.post('/api/analyze-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    const result = await aiSongwriterService.analyzePrompt(prompt);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/analyze-prompt:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Generate lyrics endpoint
app.post('/api/generate-lyrics', async (req, res) => {
  try {
    const { analysis, customInstructions, length, rhymeDensity, emotionalIntensity } = req.body;
    if (!analysis) {
      res.status(400).json({ error: 'Song analysis is required' });
      return;
    }
    const result = await aiSongwriterService.generateLyrics(
      analysis,
      customInstructions,
      length,
      rhymeDensity,
      emotionalIntensity
    );
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-lyrics:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Generate style endpoint
app.post('/api/generate-style', async (req, res) => {
  try {
    const { analysis } = req.body;
    if (!analysis) {
      res.status(400).json({ error: 'Song analysis is required' });
      return;
    }
    const result = await aiSongwriterService.generateMusicStyle(analysis);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-style:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Generate full song endpoint (analyzes prompt + generates lyrics + generates style)
app.post('/api/generate-full', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }
    const result = await aiSongwriterService.generateFullSong(prompt);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-full:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Advanced AI Actions (rewrite, alternative hooks, shorten, translate, youtube metadata, etc.)
app.post('/api/ai-action', async (req, res) => {
  try {
    const { action, payload } = req.body;
    if (!action) {
      res.status(400).json({ error: 'Action is required' });
      return;
    }
    const result = await aiSongwriterService.performAiAction(action, payload || {});
    res.json(result);
  } catch (err: any) {
    console.error(`Error in /api/ai-action (${req.body?.action}):`, err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[AI Khmer Songwriter Pro] Server running at http://0.0.0.0:${port}`);
    console.log(`[AI Khmer Songwriter Pro] Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(`[AI Khmer Songwriter Pro] Gemini API: ${aiSongwriterService.isConfigured() ? 'Connected' : 'Demo fallback ready'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
