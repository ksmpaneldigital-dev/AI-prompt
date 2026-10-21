import { aiSongwriterService } from '../../server/aiService.js';

export const handler = async (event: any) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    if (path === '/status' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          apiKeyConfigured: aiSongwriterService.isConfigured(),
          provider: aiSongwriterService.isConfigured() ? 'gemini' : 'demo',
          model: 'gemini-3.8-flash',
          platform: 'netlify',
        }),
      };
    }

    if (method === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};

      if (path === '/analyze-prompt') {
        const result = await aiSongwriterService.analyzePrompt(body.prompt || '');
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      if (path === '/generate-lyrics') {
        const result = await aiSongwriterService.generateLyrics(
          body.analysis,
          body.customInstructions,
          body.length,
          body.rhymeDensity,
          body.emotionalIntensity
        );
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      if (path === '/generate-style') {
        const result = await aiSongwriterService.generateMusicStyle(body.analysis);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      if (path === '/generate-full') {
        const result = await aiSongwriterService.generateFullSong(body.prompt || '');
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }

      if (path === '/ai-action') {
        const result = await aiSongwriterService.performAiAction(body.action, body.payload || {});
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Not found: ${method} ${path}` }),
    };
  } catch (error: any) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
