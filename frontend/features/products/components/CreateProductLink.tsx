'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/frontend/components/ui/button';

export const CreateProductLink = () => {
  const { t } = useTranslation('product');
  const { lng } = useParams<{ lng: string }>();

  return (
    <Button asChild>
      <Link href={`/${lng}/admin/products/create`}>
        <Plus size={4} />
        {t('createProduct')}
      </Link>
    </Button>
  );
};
