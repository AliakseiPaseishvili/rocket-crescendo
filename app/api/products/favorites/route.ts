import { NextResponse } from "next/server";

import { ProductService } from "@/backend/services/ProductService";

const service = new ProductService();

export async function GET() {
  try {
    const products = await service.getFavorites();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
