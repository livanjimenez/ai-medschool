export type Role = 'user' | 'assistant';

export interface ImageAttachment {
  id: string;
  dataUrl: string; // base64 data URL
  name: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  images?: ImageAttachment[];
  subject?: string; // detected MCAT subject, populated by assistant
  streaming?: boolean; // true while tokens are still arriving (Phase 4)
}
