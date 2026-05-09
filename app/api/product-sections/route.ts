import { NextRequest, NextResponse } from "next/server";

import { withAdminAuth } from "@/backend/features/auth";
import { ProductSectionService } from "@/backend/features/product-section";
import type { ProductSectionFilter } from "@/backend/features/product-section";

const service = new ProductSectionService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const filter: ProductSectionFilter = {};
    if (productId) filter.productId = productId;
    const sections = await service.getAll(
      Object.keys(filter).length ? filter : undefined,
    );
    return NextResponse.json(sections);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch sections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    const section = await service.create(body);
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create section";
    return NextResponse.json({ error: message }, { status: 400 });
  }
});
