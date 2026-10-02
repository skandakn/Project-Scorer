// AIProvider Abstraction Layer
// Encapsulates LLM interactions across OpenAI-compatible APIs and Gemini
// Keeps API secrets strictly server-side

export interface AICompletionOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
}

export interface AIProviderStatus {
  isConfigured: boolean;
  providerName: 'OpenAI' | 'Gemini' | 'Custom-OpenAI-Compatible' | 'Built-in Intelligent Engine';
  modelName: string;
}

export class AIProvider {
  static getStatus(): AIProviderStatus {
    if (process.env.OPENAI_API_KEY) {
      const isCustomBase = process.env.OPENAI_API_BASE && !process.env.OPENAI_API_BASE.includes('api.openai.com');
      return {
        isConfigured: true,
        providerName: isCustomBase ? 'Custom-OpenAI-Compatible' : 'OpenAI',
        modelName: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      };
    }
    if (process.env.GEMINI_API_KEY) {
      return {
        isConfigured: true,
        providerName: 'Gemini',
        modelName: 'gemini-1.5-flash',
      };
    }
    return {
      isConfigured: false,
      providerName: 'Built-in Intelligent Engine',
      modelName: 'Heuristic-Context-Engine-v2',
    };
  }

  static async generateCompletion(options: AICompletionOptions): Promise<string> {
    const { systemPrompt, userPrompt, temperature = 0.4, maxTokens = 2500, responseFormat = 'text' } = options;

    // 1. Try OpenAI or OpenAI-compatible endpoint
    if (process.env.OPENAI_API_KEY) {
      const baseUrl = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: userPrompt },
          ],
          ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI-compatible API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }

    // 2. Try Gemini API
    if (process.env.GEMINI_API_KEY) {
      const model = 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                ...(systemPrompt ? [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}\n\n` }] : []),
                { text: userPrompt },
              ],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            ...(responseFormat === 'json' ? { responseMimeType: 'application/json' } : {}),
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // 3. Fallback indicates to caller that offline heuristic engine should run
    throw new Error('NO_EXTERNAL_KEY_CONFIGURED');
  }
}
