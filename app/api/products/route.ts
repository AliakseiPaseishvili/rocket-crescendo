import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/backend/services/ProductService";

const service = new ProductService();

export async function GET() {
  try {
    const products = await service.getAll();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
