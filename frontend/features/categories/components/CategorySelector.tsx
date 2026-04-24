"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";

import { useCategories } from "../hooks";
import { CategorySelectItem } from "./CategorySelectItem";

type CategorySelectorProps = {
  value: string;
  onChange: (value: number) => void;
  error?: string;
};

export const CategorySelector = ({
  value,
  onChange,
  error,
}: CategorySelectorProps) => {
  const tProduct = useTranslations("product");
  const tCategory = useTranslations("category");
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading)
    return (
      <p className="text-sm text-muted-foreground">
        {tCategory("loadingCategories")}
      </p>
    );
  if (isError)
    return (
      <p className="text-sm text-destructive">
        {tCategory("errorLoadingCategories")}
      </p>
    );

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value ? String(value) : ""}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={tProduct("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <CategorySelectItem key={category.id} category={category} />
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
