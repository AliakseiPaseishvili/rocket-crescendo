# Backend CRUD Templates

Two variants: **with relations** (e.g. entity + translation table) and **simple** (flat entity, no related records). Pick the one that matches the entity, then substitute `<Entity>` / `<entity>` / `<relation>` throughout.

---

## Prisma schema

### With translation table
```prisma
model <Entity> {
  id           Int                    @id @default(autoincrement())
  active       Boolean                @default(true)
  translations <Entity>Translation[]
}

model <Entity>Translation {
  id          Int     @id @default(autoincrement())
  <entity>Id  Int
  language    String
  name        String
  description String
  <entity>    <Entity> @relation(fields: [<entity>Id], references: [id], onDelete: Cascade)

  @@unique([<entity>Id, language])
}
```

### Simple (flat)
```prisma
model <Entity> {
  id     Int     @id @default(autoincrement())
  name   String
  active Boolean @default(true)
}
```

After adding models run: `npx prisma generate`

---

## `types.ts` — with relations

```ts
import {
  <Entity>TranslationModel,
  <Entity>TranslationCreateInput,
  <Entity>CreateInput as <Entity>CreateInputBase,
  <Entity>UpdateInput as <Entity>UpdateInputBase,
} from '../../app/generated/prisma/models';

export type { <Entity>Model, <Entity>WhereInput } from '../../app/generated/prisma/models/<Entity>';
export type { <Entity>TranslationModel } from '../../app/generated/prisma/models/<Entity>Translation';

export type <Entity>WithRelations = {
  id: number;
  active: boolean;
  translations: <Entity>TranslationModel[];
};

export type <Entity>CreateInput = Omit<<Entity>CreateInputBase, 'translations'> & {
  active?: boolean;
  translations: Omit<<Entity>TranslationCreateInput, '<entity>'>[];
};

export type <Entity>UpdateInput = <Entity>UpdateInputBase & {
  translations?: Omit<<Entity>TranslationCreateInput, '<entity>'>[];
};

export type <Entity>Filter = {
  active?: boolean;
};
```

## `types.ts` — simple

```ts
import {
  <Entity>CreateInput as <Entity>CreateInputBase,
  <Entity>UpdateInput as <Entity>UpdateInputBase,
} from '../../app/generated/prisma/models';

export type { <Entity>Model, <Entity>WhereInput } from '../../app/generated/prisma/models/<Entity>';

export type <Entity>CreateInput = <Entity>CreateInputBase;

export type <Entity>UpdateInput = Partial<<Entity>UpdateInputBase>;

export type <Entity>Filter = {
  active?: boolean;
};
```

---

## `<Entity>.repository.ts` — with relations

```ts
import type {
  <Entity>CreateInput,
  <Entity>Filter,
  <Entity>UpdateInput,
  <Entity>WhereInput,
  <Entity>WithRelations,
} from './types';
import prisma from '../../prisma/prisma';

export class <Entity>Repository {
  async findAll(filter?: <Entity>Filter): Promise<<Entity>WithRelations[]> {
    const where: <Entity>WhereInput = {};
    if (filter) {
      if (typeof filter.active === 'boolean') where.active = filter.active;
    }
    return prisma.<entity>.findMany({
      where,
      include: { translations: true },
    });
  }

  async findById(id: number): Promise<<Entity>WithRelations | null> {
    return prisma.<entity>.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async create(data: <Entity>CreateInput): Promise<<Entity>WithRelations> {
    return prisma.<entity>.create({
      data: {
        active: data.active ?? true,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
  }

  async update(id: number, data: <Entity>UpdateInput): Promise<<Entity>WithRelations> {
    return prisma.<entity>.update({
      where: { id },
      data: {
        ...(data.active !== undefined && { active: data.active }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: { translations: true },
    });
  }

  async delete(id: number): Promise<<Entity>WithRelations> {
    return prisma.<entity>.delete({
      where: { id },
      include: { translations: true },
    });
  }
}
```

## `<Entity>.repository.ts` — simple

```ts
import type { <Entity>CreateInput, <Entity>Filter, <Entity>UpdateInput, <Entity>WhereInput } from './types';
import type { <Entity>Model } from '../../app/generated/prisma/models';
import prisma from '../../prisma/prisma';

export class <Entity>Repository {
  async findAll(filter?: <Entity>Filter): Promise<<Entity>Model[]> {
    const where: <Entity>WhereInput = {};
    if (filter) {
      if (typeof filter.active === 'boolean') where.active = filter.active;
    }
    return prisma.<entity>.findMany({ where });
  }

  async findById(id: number): Promise<<Entity>Model | null> {
    return prisma.<entity>.findUnique({ where: { id } });
  }

  async create(data: <Entity>CreateInput): Promise<<Entity>Model> {
    return prisma.<entity>.create({ data });
  }

  async update(id: number, data: <Entity>UpdateInput): Promise<<Entity>Model> {
    return prisma.<entity>.update({ where: { id }, data });
  }

  async delete(id: number): Promise<<Entity>Model> {
    return prisma.<entity>.delete({ where: { id } });
  }
}
```

---

## `<Entity>.service.ts`

Same structure for both variants — only the type imports differ.

```ts
import { <Entity>Repository } from './<Entity>.repository';
import type {
  <Entity>CreateInput,
  <Entity>Filter,
  <Entity>UpdateInput,
  <Entity>WithRelations,  // or <Entity>Model for simple entities
} from './types';

export class <Entity>Service {
  private readonly repository: <Entity>Repository;

  constructor() {
    this.repository = new <Entity>Repository();
  }

  async getAll(filter?: <Entity>Filter): Promise<<Entity>WithRelations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: number): Promise<<Entity>WithRelations> {
    const item = await this.repository.findById(id);
    // This exact wording is checked in API routes to distinguish 404 vs 400
    if (!item) throw new Error(`<Entity> with id ${id} not found`);
    return item;
  }

  async create(data: <Entity>CreateInput): Promise<<Entity>WithRelations> {
    // Validate required fields — validation belongs here, not in the repository
    if (!data.translations?.length) throw new Error('At least one translation is required');
    for (const t of data.translations) {
      if (!t.name?.trim()) throw new Error(`Name is required for language: ${t.language}`);
      if (!t.description?.trim()) throw new Error(`Description is required for language: ${t.language}`);
    }
    return this.repository.create(data);
  }

  async update(id: number, data: <Entity>UpdateInput): Promise<<Entity>WithRelations> {
    await this.getById(id); // throws 'not found' if missing
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<<Entity>WithRelations> {
    await this.getById(id); // throws 'not found' if missing
    return this.repository.delete(id);
  }
}
```

---

## `index.ts` (barrel)

```ts
export { <Entity>Service } from './<Entity>.service';
export type {
  <Entity>Model,
  <Entity>WithRelations,  // omit if simple entity
  <Entity>CreateInput,
  <Entity>UpdateInput,
  <Entity>Filter,
} from './types';
```

---

## `app/api/<entity>/route.ts` (collection — GET list + POST create)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Entity>Service } from '@/backend/features/<entity>';
import type { <Entity>Filter } from '@/backend/features/<entity>';

const service = new <Entity>Service();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeParam = searchParams.get('active');
    const filter: <Entity>Filter = {};
    if (activeParam !== null) filter.active = activeParam === 'true';
    const items = await service.getAll(Object.keys(filter).length ? filter : undefined);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch <entity>s';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await service.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create <entity>';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
```

---

## `app/api/<entity>/[id]/route.ts` (single item — GET + PATCH + DELETE)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { <Entity>Service } from '@/backend/features/<entity>';

const service = new <Entity>Service();

// Next.js 16: params is a Promise — always await it
type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const item = await service.getById(Number(id));
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await service.update(Number(id), body);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update <entity>';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await service.delete(Number(id));
    return new NextResponse(null, { status: 204 }); // no body
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete <entity>';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
```

---

## Quick reference — substitutions

| Placeholder | Replace with | Example |
|---|---|---|
| `<Entity>` | PascalCase entity name | `Category` |
| `<entity>` | camelCase entity name | `category` |
| `<relation>` | camelCase relation name | `translations` |
| `<Entity>Translation` | PascalCase relation model | `CategoryTranslation` |
| `<entity>Id` | camelCase foreign key field | `categoryId` |
