'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';
import { formUrlParams } from '@/frontend/utils/form-url';

export const CreateProductLink = () => {
  const t = useTranslations('product');
  const { lng } = useParams<{ lng: string }>();

  return (
    <Button asChild>
      <Link href={formUrlParams({ url: ROUTES.ADMIN_PRODUCTS_CREATE, params: { lng } })}>
        <Plus size={4} />
        {t('createProduct')}
      </Link>
    </Button>
  );
};
