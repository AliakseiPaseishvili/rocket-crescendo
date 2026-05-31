'use client';

import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';
import { Button } from '@/frontend/components/ui/button';
import { usePickTranslation } from '@/frontend/features/translation';

import { VideoLessonList } from './VideoLessonList';
import { useDeleteProductSection } from '../hooks/use-delete-product-section';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface ProductSectionCardProps {
  section: ProductSectionWithTranslations;
  productId: string;
}

export const ProductSectionCard: FC<ProductSectionCardProps> = ({ section, productId }) => {
  const tVl = useTranslations('videoLesson');
  const [expanded, setExpanded] = useState(true);
  const translation = usePickTranslation(section.translations);
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteProductSection(productId);
  const openEditSection = useVideoLessonsPanelStore((s) => s.openEditSection);

  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-left flex-1 min-w-0"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="font-medium truncate">{translation?.name ?? '—'}</span>
        </button>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => openEditSection(section, productId)}
            aria-label={tVl('editSection')}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={isDeleting}
            onClick={() => deleteSection({ params: { id: section.id } })}
            aria-label={tVl('deleteSection')}
          >
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      </div>

      {expanded && <VideoLessonList sectionId={section.id} />}
    </div>
  );
};
