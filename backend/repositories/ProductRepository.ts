import prisma from "@/backend/prisma/prisma";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  ProductModel,
} from "@/backend/app/generated/prisma/models/Product";

export class ProductRepository {
  async findAll(): Promise<ProductModel[]> {
    return prisma.product.findMany();
  }

  async findById(id: number): Promise<ProductModel | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: ProductCreateInput): Promise<ProductModel> {
    return prisma.product.create({ data });
  }

  async update(id: number, data: ProductUpdateInput): Promise<ProductModel> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number): Promise<ProductModel> {
    return prisma.product.delete({ where: { id } });
  }
}
