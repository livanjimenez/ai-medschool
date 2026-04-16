import { streamText, ImagePart, TextPart } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { SYSTEM_PROMPT } from '@/lib/system-prompt';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

// Shape sent from ChatPage
interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
  images?: { dataUrl: string; name: string }[];
}

function dataUrlToBase64(dataUrl: string): {
  base64: string;
  mediaType: string;
} {
  // dataUrl format: "data:<mediaType>;base64,<data>"
  const [meta, base64] = dataUrl.split(',');
  const mediaType = meta.replace('data:', '').replace(';base64', '');
  return { base64, mediaType };
}

export async function POST(req: Request) {
  const { messages }: { messages: IncomingMessage[] } = await req.json();

  // Convert our message format to AI SDK ModelMessage format
  const modelMessages = messages.map((msg) => {
    if (msg.role === 'assistant') {
      return { role: 'assistant' as const, content: msg.content };
    }

    // Build user content parts: text + images
    const parts: Array<TextPart | ImagePart> = [];

    if (msg.content) {
      parts.push({ type: 'text', text: msg.content });
    }

    if (msg.images && msg.images.length > 0) {
      for (const img of msg.images) {
        const { base64, mediaType } = dataUrlToBase64(img.dataUrl);
        parts.push({
          type: 'image',
          image: base64,
          mediaType: mediaType as ImagePart['mediaType'],
        });
      }
    }

    return {
      role: 'user' as const,
      content:
        parts.length === 1 && parts[0].type === 'text'
          ? (parts[0] as TextPart).text
          : parts,
    };
  });

  const result = streamText({
    model: openrouter('google/gemini-2.5-pro-preview'),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toTextStreamResponse();
}
