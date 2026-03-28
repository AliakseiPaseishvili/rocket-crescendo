'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';
import { Link } from '@/i18n/navigation';

export const CreateProductLink = () => {
  const t = useTranslations('product');

  return (
    <Button asChild>
      <Link href={ROUTES.ADMIN_PRODUCTS_CREATE}>
        <Plus size={4} />
        {t('createProduct')}
      </Link>
    </Button>
  );
};
