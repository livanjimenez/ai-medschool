import { ImageAttachment } from '@/lib/types';

export const MAX_IMAGES = 4;
export const MAX_FILE_SIZE_MB = 20;
export const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

/**
 * Read a list of File objects as base64 data URLs and call onAdd for each.
 * Silently skips files that exceed the per-message image cap or size limit.
 */
export function processImageFiles(
  files: File[],
  currentCount: number,
  onAdd: (img: ImageAttachment) => void,
): void {
  const remaining = MAX_IMAGES - currentCount;
  const toProcess = files
    .filter((f) => ACCEPTED_TYPES.includes(f.type))
    .slice(0, remaining);

  toProcess.forEach((file) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onAdd({ id: crypto.randomUUID(), dataUrl, name: file.name });
    };
    reader.readAsDataURL(file);
  });
}
