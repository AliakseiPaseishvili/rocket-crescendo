'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { QRCodeCanvas } from 'qrcode.react';
import { FC, useRef, useState } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/frontend/components/ui/tabs';
import { SUPPORTED_LANGUAGE, languageLabels, supportedLngs } from '@/frontend/features/translation';

interface LessonShareQrCodeProps {
  bookId: string;
  lessonId: string;
}

export const LessonShareQrCode: FC<LessonShareQrCodeProps> = ({ bookId, lessonId }) => {
  const tVl = useTranslations('videoLesson');
  const [activeLng, setActiveLng] = useState<SUPPORTED_LANGUAGE>(supportedLngs[0]);
  const [copied, setCopied] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const buildUrl = (lng: SUPPORTED_LANGUAGE) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/${lng}/books/${bookId}/lessons/${lessonId}`;
  };

  const lessonUrl = buildUrl(activeLng);

  const handleCopy = () => {
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard image write unsupported — ignore.
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-4">
      <h3 className="text-sm font-semibold">{tVl('lessonLink')}</h3>

      <Tabs value={activeLng} onValueChange={(value) => setActiveLng(value as SUPPORTED_LANGUAGE)}>
        <TabsList>
          {supportedLngs.map((lng) => (
            <TabsTrigger key={lng} value={lng}>
              {languageLabels[lng]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div ref={canvasContainerRef} className="flex justify-center py-2">
        <QRCodeCanvas value={lessonUrl} size={180} marginSize={2} />
      </div>

      <a
        href={lessonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-center text-sm text-primary underline-offset-4 hover:underline"
      >
        {tVl('openLessonPage')}
      </a>

      <Button variant="outline" size="sm" className="self-center" onClick={handleCopy}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? tVl('qrCopied') : tVl('copyQrCode')}
      </Button>
    </div>
  );
};
