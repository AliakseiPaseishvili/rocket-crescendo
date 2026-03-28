import { CategoryRepository } from './Category.repository';
import type {
  CategoryCreateInput,
  CategoryFilter,
  CategoryUpdateInput,
  CategoryWithTranslations,
} from './types';

export class CategoryService {
  private readonly repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  async getAll(filter?: CategoryFilter): Promise<CategoryWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: number): Promise<CategoryWithTranslations> {
    const category = await this.repository.findById(id);
    if (!category) throw new Error(`Category with id ${id} not found`);
    return category;
  }

  async create(data: CategoryCreateInput): Promise<CategoryWithTranslations> {
    if (!data.color?.trim()) throw new Error('Color is required');
    if (!data.translations?.length) throw new Error('At least one translation is required');
    for (const t of data.translations) {
      if (!t.name?.trim()) throw new Error(`Name is required for language: ${t.language}`);
    }
    return this.repository.create(data);
  }

  async update(id: number, data: CategoryUpdateInput): Promise<CategoryWithTranslations> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<CategoryWithTranslations> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
