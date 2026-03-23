'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/frontend/components/ui/button';
import { ROUTES } from '@/frontend/constants';
import { fillUrl } from '@/frontend/utils/fill-url';

export const CreateProductLink = () => {
  const { t } = useTranslation('product');
  const { lng } = useParams<{ lng: string }>();

  return (
    <Button asChild>
      <Link href={fillUrl({ url: ROUTES.ADMIN_PRODUCTS_CREATE, params: { lng } })}>
        <Plus size={4} />
        {t('createProduct')}
      </Link>
    </Button>
  );
};
