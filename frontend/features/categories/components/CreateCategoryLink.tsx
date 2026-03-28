'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';
import { Link } from '@/frontend/features/translation/i18n/navigation';

export const CreateCategoryLink = () => {
  const t = useTranslations('category');

  return (
    <Button asChild>
      <Link href={ROUTES.ADMIN_CATEGORIES_CREATE}>
        <Plus size={4} />
        {t('createCategory')}
      </Link>
    </Button>
  );
};
