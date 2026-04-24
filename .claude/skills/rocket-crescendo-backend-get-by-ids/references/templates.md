# `getByIds` Templates

Substitute `<Entity>` (PascalCase), `<entity>` (camelCase), and `<ReturnType>` throughout.

---

## Repository — add `findByIds` after `findById`

### With relations (entity has translations or other includes)

```ts
async findByIds(ids: string[]): Promise<<ReturnType>[]> {
  return prisma.<entity>.findMany({
    where: { id: { in: ids } },
    include: { translations: true },
  });
}
```

### Simple (flat entity, no relations)

```ts
async findByIds(ids: string[]): Promise<<ReturnType>[]> {
  return prisma.<entity>.findMany({
    where: { id: { in: ids } },
  });
}
```

---

## Service — add `getByIds` after `getById`

```ts
async getByIds(ids: string[]): Promise<<ReturnType>[]> {
  return this.repository.findByIds(ids);
}
```

---

## `app/api/<entity>/by-ids/route.ts` (new file)

```ts
import { NextRequest, NextResponse } from 'next/server';

import { <Entity>Service } from '@/backend/features/<entity>';

const service = new <Entity>Service();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = body?.ids;
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });
    }
    const items = await service.getByIds(ids);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch <entity>s';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

---

## Quick reference — substitutions

| Placeholder | Replace with | Example |
|---|---|---|
| `<Entity>` | PascalCase entity name | `Product` |
| `<entity>` | camelCase entity name | `product` |
| `<ReturnType>` | Return type used in existing `findById` / `getById` | `ProductWithTranslations` |

---

## Real example — Product feature (no `getByIds` yet)

After applying the skill, `Product.repository.ts` gains:

```ts
async findByIds(ids: string[]): Promise<ProductWithTranslations[]> {
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: { translations: true },
  });
}
```

`Product.service.ts` gains:

```ts
async getByIds(ids: string[]): Promise<ProductWithTranslations[]> {
  return this.repository.findByIds(ids);
}
```

`app/api/products/by-ids/route.ts` is created as:

```ts
import { NextRequest, NextResponse } from 'next/server';

import { ProductService } from '@/backend/features/product';

const service = new ProductService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = body?.ids;
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids must be an array' }, { status: 400 });
    }
    const items = await service.getByIds(ids);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```
