'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { ImageAttachment } from '@/lib/types';

interface ImagePreviewProps {
  images: ImageAttachment[];
  onRemove: (id: string) => void;
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-2">
      {images.map((img) => (
        <div key={img.id} className="relative group">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
            <Image
              src={img.dataUrl}
              alt={img.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => onRemove(img.id)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-600 hover:bg-zinc-500 text-zinc-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove ${img.name}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
