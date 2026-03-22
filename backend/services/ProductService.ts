import type {
  ProductCreateInput,
  ProductUpdateInput,
  ProductModel,
} from "@/backend/app/generated/prisma/models/Product";
import { ProductRepository } from "@/backend/repositories/ProductRepository";

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAll(): Promise<ProductModel[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<ProductModel> {
    const product = await this.repository.findById(id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  }

  async create(data: ProductCreateInput): Promise<ProductModel> {
    if (!data.name?.trim()) throw new Error("Product name is required");
    if (!data.description?.trim()) throw new Error("Product description is required");
    return this.repository.create(data);
  }

  async update(id: number, data: ProductUpdateInput): Promise<ProductModel> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<ProductModel> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
