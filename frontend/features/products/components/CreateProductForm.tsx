'use client';

import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/frontend/components/ui/button';
import { Checkbox } from '@/frontend/components/ui/checkbox';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/frontend/components/ui/tabs';
import { Textarea } from '@/frontend/components/ui/textarea';
import { languageLabels, supportedLngs } from '@/frontend/features/translation';

import { useCreateProductForm } from '../hooks';

export const CreateProductForm = () => {
  const { t } = useTranslation(['product', 'common']);
  const { register, control, errors, onSubmit, isPending, isSuccess, error } = useCreateProductForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-2xl font-bold">{t('product:createProduct')}</h2>

      <Tabs defaultValue={supportedLngs[0]}>
        <TabsList className="w-full">
          {supportedLngs.map((lng) => (
            <TabsTrigger key={lng} value={lng} className="flex-1">
              {languageLabels[lng]}
            </TabsTrigger>
          ))}
        </TabsList>

        {supportedLngs.map((lng) => (
          <TabsContent key={lng} value={lng} className="flex flex-col gap-3 mt-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor={`${lng}_name`}>{t('common:name')}</Label>
              <Input
                id={`${lng}_name`}
                type="text"
                placeholder={t('product:namePlaceholder')}
                {...register(`${lng}_name` as const, { required: t('common:nameRequired') })}
              />
              {(errors as Record<string, { message?: string }>)[`${lng}_name`] && (
                <p className="text-sm text-destructive">
                  {(errors as Record<string, { message?: string }>)[`${lng}_name`]?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor={`${lng}_description`}>{t('common:description')}</Label>
              <Textarea
                id={`${lng}_description`}
                placeholder={t('product:descriptionPlaceholder')}
                rows={3}
                {...register(`${lng}_description` as const, { required: t('common:descriptionRequired') })}
              />
              {(errors as Record<string, { message?: string }>)[`${lng}_description`] && (
                <p className="text-sm text-destructive">
                  {(errors as Record<string, { message?: string }>)[`${lng}_description`]?.message}
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center gap-2">
        <Controller
          name="favorite"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="favorite"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="favorite" className="cursor-pointer">
          {t('product:favorite')}
        </Label>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {isSuccess && <p className="text-sm text-green-600">{t('product:createSuccess')}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? t('common:creating') : t('product:createProduct')}
      </Button>
    </form>
  );
};
