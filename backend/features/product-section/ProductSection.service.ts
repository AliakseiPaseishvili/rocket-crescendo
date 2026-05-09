import { ProductSectionRepository } from "./ProductSection.repository";
import type {
  ProductSectionCreateInput,
  ProductSectionFilter,
  ProductSectionUpdateInput,
  ProductSectionWithTranslations,
} from "./types";

export class ProductSectionService {
  private readonly repository: ProductSectionRepository;

  constructor() {
    this.repository = new ProductSectionRepository();
  }

  async getAll(
    filter?: ProductSectionFilter,
  ): Promise<ProductSectionWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: string): Promise<ProductSectionWithTranslations> {
    const section = await this.repository.findById(id);
    if (!section) throw new Error(`ProductSection with id ${id} not found`);
    return section;
  }

  async create(
    data: ProductSectionCreateInput,
  ): Promise<ProductSectionWithTranslations> {
    if (!data.productId) throw new Error("productId is required");
    if (!data.translations?.length)
      throw new Error("At least one translation is required");
    for (const t of data.translations) {
      if (!t.name?.trim())
        throw new Error(`Name is required for language: ${t.language}`);
    }
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: ProductSectionUpdateInput,
  ): Promise<ProductSectionWithTranslations> {
    await this.getById(id);
    if (data.translations !== undefined) {
      if (!data.translations.length)
        throw new Error("At least one translation is required");
      for (const t of data.translations) {
        if (!t.name?.trim())
          throw new Error(`Name is required for language: ${t.language}`);
      }
    }
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<ProductSectionWithTranslations> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
