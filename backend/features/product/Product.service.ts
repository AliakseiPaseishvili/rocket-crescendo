import { ProductFileRole } from "@/backend/app/generated/prisma/enums";

import { ProductRepository } from "./Product.repository";
import {
  type ProductCreateInput,
  type ProductFileInput,
  type ProductFilter,
  type ProductUpdateInput,
  type ProductWithTranslations,
} from "./types";

export class ProductService {
  private readonly repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async getAll(filter?: ProductFilter): Promise<ProductWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: string): Promise<ProductWithTranslations> {
    const product = await this.repository.findById(id);
    if (!product) throw new Error(`Product with id ${id} not found`);
    return product;
  }

  private validateFiles(files: ProductFileInput[] | undefined): void {
    if (!files?.length) return;
    const validRoles = new Set([
      ProductFileRole.MAIN_IMAGE,
      ProductFileRole.VIDEO,
      ProductFileRole.ADDITIONAL_IMAGE,
    ]);
    for (const f of files) {
      if (!validRoles.has(f.role))
        throw new Error(`Invalid file role: "${f.role}"`);
    }
    const uniqueIds = new Set(files.map((f) => f.fileId));
    if (uniqueIds.size !== files.length)
      throw new Error("Duplicate file IDs are not allowed");
    if (files.length > 10)
      throw new Error("A product can have at most 10 files");
    const mainImages = files.filter(
      (f) => f.role === ProductFileRole.MAIN_IMAGE,
    );
    const videos = files.filter((f) => f.role === ProductFileRole.VIDEO);
    const additional = files.filter(
      (f) => f.role === ProductFileRole.ADDITIONAL_IMAGE,
    );
    if (mainImages.length > 1)
      throw new Error("A product can have at most 1 main image");
    if (videos.length > 1)
      throw new Error("A product can have at most 1 video");
    if (additional.length > 8)
      throw new Error("A product can have at most 8 additional images");
  }

  async create(data: ProductCreateInput): Promise<ProductWithTranslations> {
    if (!data.categoryId) throw new Error("categoryId is required");
    if (data.price !== undefined && data.price <= 0)
      throw new Error("Price must be a positive number");
    if (!data.translations?.length)
      throw new Error("At least one translation is required");
    for (const translation of data.translations) {
      const { name, description, language } = translation;
      if (!name?.trim())
        throw new Error(`Name is required for language: ${language}`);
      if (!description?.trim())
        throw new Error(`Description is required for language: ${language}`);
    }
    this.validateFiles(data.files);
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: ProductUpdateInput,
  ): Promise<ProductWithTranslations> {
    await this.getById(id);
    this.validateFiles(data.files);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<ProductWithTranslations> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
