'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';
import { DrawerClose } from '@/frontend/components/ui/drawer';
import { ROUTES } from '@/frontend/constants';
import { useSession } from '@/frontend/features/auth';
import { Link } from '@/frontend/features/translation/i18n/navigation';

import { CartItemRow } from './CartItemRow';
import { useCartProducts } from '../hooks/use-cart-products';

export const CartContent = () => {
  const t = useTranslations('cart');
  const { data: session } = useSession();
  const { items, products, isLoading } = useCartProducts();

  // Registered users go straight to the form; guests first pick guest vs. sign-in.
  const checkoutHref = session?.user.email
    ? ROUTES.CHECKOUT
    : ROUTES.CHECKOUT_OPTIONS;

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-muted-foreground">
        <ShoppingCart className="h-10 w-10 opacity-40" />
        <p className="text-sm">{t('empty')}</p>
      </div>
    );
  }

  const productById = new Map(products.map((p) => [p.id, p]));
  const total = items.reduce((sum, item) => {
    const product = productById.get(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 divide-y overflow-y-auto px-4">
        {items.map((item) => {
          const product = productById.get(item.productId);
          if (!product) return null;
          return (
            <CartItemRow
              key={item.productId}
              product={product}
              quantity={item.quantity}
            />
          );
        })}
      </div>
      <div className="border-t p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('total')}</span>
          <span className="text-base font-semibold">${total.toFixed(2)}</span>
        </div>
        <DrawerClose asChild>
          <Button asChild className="w-full" disabled={isLoading}>
            <Link href={checkoutHref}>{t('checkout')}</Link>
          </Button>
        </DrawerClose>
      </div>
    </div>
  );
};
