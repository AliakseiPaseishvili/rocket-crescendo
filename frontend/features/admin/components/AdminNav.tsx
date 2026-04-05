'use client';

import { FileImage, LayoutList, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';
import { ROUTES } from '@/frontend/constants';
import { Link } from '@/frontend/features/translation/i18n/navigation';

const ADMIN_LINKS = [
  {
    labelKey: 'product.products' as const,
    descriptionKey: 'admin.productsDescription' as const,
    href: ROUTES.ADMIN_PRODUCTS,
    icon: LayoutList,
  },
  {
    labelKey: 'category.categories' as const,
    descriptionKey: 'admin.categoriesDescription' as const,
    href: ROUTES.ADMIN_CATEGORIES,
    icon: Tag,
  },
  {
    labelKey: 'file.files' as const,
    descriptionKey: 'admin.filesDescription' as const,
    href: ROUTES.ADMIN_FILES,
    icon: FileImage,
  },
];

export const AdminNav = () => {
  const t = useTranslations();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ADMIN_LINKS.map(({ labelKey, descriptionKey, href, icon: Icon }) => (
        <Link key={href} href={href}>
          <Card className="hover:bg-muted transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon size={20} />
                {t(labelKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t(descriptionKey)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
