'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImagePreview from '@/components/ImagePreview';
import { ImageAttachment } from '@/lib/types';
import { MAX_IMAGES } from '@/lib/images';

interface ChatInputProps {
  onSend: (text: string, images: ImageAttachment[]) => void;
  isLoading: boolean;
  images: ImageAttachment[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
}

export default function ChatInput({
  onSend,
  isLoading,
  images,
  onAddImages,
  onRemoveImage,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  const canSend = (text.trim().length > 0 || images.length > 0) && !isLoading;

  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    onSend(text.trim(), images);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    // images are cleared by ChatPage after send
  }, [canSend, onSend, text, images]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    onAddImages(files);
  };

  const removeImage = useCallback(
    (id: string) => onRemoveImage(id),
    [onRemoveImage],
  );

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-zinc-700 bg-zinc-900 focus-within:border-zinc-500 transition-colors">
      {/* Image preview strip */}
      {images.length > 0 && (
        <div className="px-3 pt-3">
          <ImagePreview images={images} onRemove={removeImage} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 px-3 py-2.5">
        {/* Attach button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || images.length >= MAX_IMAGES}
          className="shrink-0 w-8 h-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 disabled:opacity-30 mb-0.5"
          aria-label="Attach image"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste an MCAT question or describe what you need help with…"
          disabled={isLoading}
          rows={1}
          className="flex-1 min-h-0 resize-none border-0 bg-transparent p-0 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed"
        />

        {/* Send button */}
        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          disabled={!canSend}
          className="shrink-0 w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
          aria-label="Send message (Ctrl+Enter)"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-zinc-600 text-center pb-2 select-none">
        Ctrl+Enter to send · up to {MAX_IMAGES} images per message
      </p>
    </div>
  );
}
