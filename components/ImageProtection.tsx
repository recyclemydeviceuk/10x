'use client';

import { useEffect } from 'react';

export default function ImageProtection() {
  useEffect(() => {
    const isMediaElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      const tag = target.tagName;
      if (tag === 'IMG' || tag === 'VIDEO' || tag === 'PICTURE') return true;
      return !!target.closest('img, picture, video');
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (isMediaElement(event.target)) event.preventDefault();
    };

    const handleDragStart = (event: DragEvent) => {
      if (isMediaElement(event.target)) event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
