"use client";

import { FC } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/frontend/components/ui/breadcrumb";
import { Link } from "@/frontend/features/translation/i18n/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className }) => (
  <Breadcrumb className={className}>
    <BreadcrumbList>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <BreadcrumbItem key={index}>
            {!isLast && item.href ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);
