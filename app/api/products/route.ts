import { NextRequest, NextResponse } from "next/server";

import { ProductService } from "@/backend/features/product";
import type { ProductFilter } from "@/backend/features/product";

const service = new ProductService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const favoriteParam = searchParams.get("favorite");
    const filter: ProductFilter = {};
    if (favoriteParam !== null) {
      filter.favorite = favoriteParam === "true";
    }
    const products = await service.getAll(Object.keys(filter).length ? filter : undefined);
    return NextResponse.json(products);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await service.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
