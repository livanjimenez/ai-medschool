'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { RotateCcw, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import StarterPrompts from '@/components/StarterPrompts';
import { Message, ImageAttachment } from '@/lib/types';
import { processImageFiles, ACCEPTED_TYPES } from '@/lib/images';

// Extracts "Subject: X" from the first line of an assistant response
function parseSubject(content: string): string | undefined {
  const match = content.match(/^Subject:\s*(.+)/m);
  return match?.[1]?.trim();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Lifted image state (shared between drag-drop, paste, and ChatInput) ──
  const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const addImageFiles = useCallback(
    (files: File[]) => {
      processImageFiles(files, pendingImages.length, (img) =>
        setPendingImages((prev) => [...prev, img]),
      );
    },
    [pendingImages.length],
  );

  const removeImage = useCallback((id: string) => {
    setPendingImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  // ── Drag-and-drop handlers ──
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      addImageFiles(files);
    },
    [addImageFiles],
  );

  // ── Clipboard paste (window-level, catches Ctrl+V anywhere on page) ──
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageFiles = items
        .filter((item) => ACCEPTED_TYPES.includes(item.type))
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (imageFiles.length > 0) {
        e.preventDefault();
        addImageFiles(imageFiles);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addImageFiles]);

  const handleSend = useCallback(
    async (text: string, images: ImageAttachment[]) => {
      if (!text.trim() && images.length === 0) return;

      setPendingImages([]); // clear attachments immediately on send

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        images,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Create a placeholder assistant message to stream tokens into
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', streaming: true },
      ]);

      try {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
          images: m.images?.map((img) => ({
            dataUrl: img.dataUrl,
            name: img.name,
          })),
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: snapshot, subject: parseSubject(snapshot) }
                : m,
            ),
          );
        }

        // Finalize — mark streaming done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, subject: parseSubject(m.content) }
              : m,
          ),
        );
      } catch (err) {
        const errorText =
          err instanceof Error ? err.message : 'Something went wrong.';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `**Error:** ${errorText}\n\nPlease check your \`OPENAI_API_KEY\` in \`.env.local\` and try again.`,
                  streaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  const handleNewSession = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
  }, []);

  return (
    <div
      className="flex flex-col h-dvh bg-zinc-950 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag-and-drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-zinc-950/90 border-2 border-dashed border-violet-500/70 rounded-none pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-violet-400" />
          </div>
          <p className="text-sm font-medium text-violet-300">
            Drop image to attach
          </p>
          <p className="text-xs text-zinc-500">
            PNG, JPG, WebP, GIF · max 20 MB
          </p>
        </div>
      )}
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-violet-600/25 border border-violet-500/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-violet-400">M</span>
          </div>
          <span className="text-sm font-semibold text-zinc-200">
            MCAT Study Assistant
          </span>
          <span className="hidden sm:inline text-xs text-zinc-600">
            · powered by GPT-4o
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewSession}
          className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 gap-1.5 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          New session
        </Button>
      </header>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <StarterPrompts onSelect={(prompt) => handleSend(prompt, [])} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-4 pt-2 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            images={pendingImages}
            onAddImages={addImageFiles}
            onRemoveImage={removeImage}
          />
        </div>
      </div>
    </div>
  );
}
