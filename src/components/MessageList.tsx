'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import MessageBubble, { LoadingBubble } from '@/components/MessageBubble';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasStreamingMessage = messages.some((m) => m.streaming);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col py-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {/* Only show spinner while waiting for the first token; once streaming starts, the message bubble handles it */}
      {isLoading && !hasStreamingMessage && <LoadingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}
