import { create } from 'zustand';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';
import type { VideoLessonWithTranslations } from '@/backend/features/video-lesson';

type PanelMode =
  | { type: 'create-section'; productId: string }
  | { type: 'edit-section'; section: ProductSectionWithTranslations; productId: string }
  | { type: 'create-lesson'; sectionId: string }
  | { type: 'edit-lesson'; lesson: VideoLessonWithTranslations }
  | null;

interface VideoLessonsPanelStore {
  panel: PanelMode;
  openCreateSection: (productId: string) => void;
  openEditSection: (section: ProductSectionWithTranslations, productId: string) => void;
  openCreateLesson: (sectionId: string) => void;
  openEditLesson: (lesson: VideoLessonWithTranslations) => void;
  close: () => void;
}

export const useVideoLessonsPanelStore = create<VideoLessonsPanelStore>((set) => ({
  panel: null,
  openCreateSection: (productId) => set({ panel: { type: 'create-section', productId } }),
  openEditSection: (section, productId) => set({ panel: { type: 'edit-section', section, productId } }),
  openCreateLesson: (sectionId) => set({ panel: { type: 'create-lesson', sectionId } }),
  openEditLesson: (lesson) => set({ panel: { type: 'edit-lesson', lesson } }),
  close: () => set({ panel: null }),
}));
