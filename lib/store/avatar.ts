/** Profile photos are validated again by the backend before S3 upload. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export function initialsOf(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
}
