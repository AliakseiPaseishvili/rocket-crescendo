"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/frontend/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/frontend/features/breadcrumbs/types";
import { Link } from "@/frontend/features/translation/i18n/navigation";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => {
  const t = useTranslations("breadcrumb");

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <BreadcrumbItemUI key={index}>
              {!isLast && item.href ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{t(item.labelKey)}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{t(item.labelKey)}</BreadcrumbPage>
              )}
            </BreadcrumbItemUI>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
