import { ProductRepository } from "./Product.repository";
import type {
  ProductCreateInput,
  ProductFilter,
  ProductUpdateInput,
  ProductWithTranslations,
} from "./types";

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAll(filter?: ProductFilter): Promise<ProductWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: number): Promise<ProductWithTranslations> {
    const product = await this.repository.findById(id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  }

  async create(data: ProductCreateInput): Promise<ProductWithTranslations> {
    if (!data.translations?.length) throw new Error("At least one translation is required");
    for (const translation of data.translations) {
      const { name, description, language } = translation;
      if (!name?.trim()) throw new Error(`Name is required for language: ${language}`);
      if (!description?.trim()) throw new Error(`Description is required for language: ${language}`);
    }
    return this.repository.create(data);
  }

  async update(id: number, data: ProductUpdateInput): Promise<ProductWithTranslations> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<ProductWithTranslations> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
