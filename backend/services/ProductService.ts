import { ProductRepository } from "@/backend/repositories/ProductRepository";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  ProductWithTranslations,
} from "@/backend/types";

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAll(): Promise<ProductWithTranslations[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<ProductWithTranslations> {
    const product = await this.repository.findById(id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  }

  async create(data: ProductCreateInput): Promise<ProductWithTranslations> {
    if (!data.translations?.length) throw new Error("At least one translation is required");
    for (const t of data.translations) {
      if (!t.name?.trim()) throw new Error(`Name is required for language: ${t.language}`);
      if (!t.description?.trim()) throw new Error(`Description is required for language: ${t.language}`);
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
