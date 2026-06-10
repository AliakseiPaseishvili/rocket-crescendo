"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import {
  Breadcrumb,
  BreadcrumbList,
} from "@/frontend/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/frontend/features/breadcrumbs/types";

import { BreadcrumbEntry } from "./BreadcrumbEntry";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => {
  const t = useTranslations("breadcrumb");

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbEntry
            key={index}
            item={item}
            label={item.label ?? t(item.labelKey!)}
            isLast={index === items.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
