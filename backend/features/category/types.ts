import {
  CategoryTranslationModel,
  CategoryTranslationCreateInput,
  CategoryCreateInput as CategoryCreateInputBase,
  CategoryUpdateInput as CategoryUpdateInputBase,
} from '../../app/generated/prisma/models';

export type { CategoryModel, CategoryWhereInput } from '../../app/generated/prisma/models/Category';
export type { CategoryTranslationModel } from '../../app/generated/prisma/models/CategoryTranslation';

export type CategoryWithTranslations = {
  id: string;
  color: string;
  translations: CategoryTranslationModel[];
};

export type CategoryCreateInput = Omit<CategoryCreateInputBase, 'translations'> & {
  color: string;
  translations: Omit<CategoryTranslationCreateInput, 'category'>[];
};

export type CategoryUpdateInput = CategoryUpdateInputBase & {
  translations?: Omit<CategoryTranslationCreateInput, 'category'>[];
};

export type CategoryFilter = {
  color?: string;
};
