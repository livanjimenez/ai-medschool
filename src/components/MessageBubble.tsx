'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { Message } from '@/lib/types';
import SubjectBadge from '@/components/SubjectBadge';

interface MessageBubbleProps {
  message: Message;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
      aria-label="Copy response"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" />
    </div>
  );
}

export function LoadingBubble() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-violet-600/80 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white">
        M
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-zinc-800/60">
        <TypingIndicator />
      </div>
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 px-4 py-2">
        {/* Image thumbnails */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {message.images.map((img) => (
              <div
                key={img.id}
                className="w-40 h-40 rounded-xl overflow-hidden border border-zinc-700"
              >
                <Image
                  src={img.dataUrl}
                  alt={img.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        {/* Text content */}
        {message.content && (
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-zinc-700 px-4 py-2.5 text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
      </div>
    );
  }

  // Strip the "Subject: X" line from display content (badge handles it)
  const displayContent = message.content
    .replace(/^Subject:\s*.+\n?/, '')
    .trim();

  return (
    <div className="flex gap-3 px-4 py-3 group">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-violet-600/80 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white select-none">
        M
      </div>

      <div className="flex-1 min-w-0">
        {/* Subject badge */}
        {message.subject && (
          <div className="mb-2">
            <SubjectBadge subject={message.subject} />
          </div>
        )}

        {/* Markdown content */}
        <div className="prose prose-sm prose-invert max-w-none text-zinc-200 leading-relaxed [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_strong]:text-zinc-100 [&_h1]:text-zinc-100 [&_h2]:text-zinc-100 [&_h3]:text-zinc-200 [&_code]:bg-zinc-700 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-zinc-800 [&_pre]:rounded-lg [&_blockquote]:border-l-zinc-600 [&_blockquote]:text-zinc-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayContent}
          </ReactMarkdown>
          {message.streaming && (
            <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-text-bottom" />
          )}
        </div>

        {/* Copy button — only shown once streaming is done */}
        {!message.streaming && (
          <div className="flex mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={displayContent} />
          </div>
        )}
      </div>
    </div>
  );
}
