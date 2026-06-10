import { FC, ReactNode } from "react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/frontend/components/ui/breadcrumb";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/frontend/features/breadcrumbs/types";
import { Link } from "@/frontend/features/translation/i18n/navigation";

interface BreadcrumbEntryProps {
  item: BreadcrumbItemType;
  label: ReactNode;
  isLast: boolean;
}

export const BreadcrumbEntry: FC<BreadcrumbEntryProps> = ({
  item,
  label,
  isLast,
}) => {
  const content = item.isLoading ? <Skeleton className="h-4 w-24" /> : label;

  return (
    <BreadcrumbItem>
      {!isLast && item.href ? (
        <>
          <BreadcrumbLink asChild>
            <Link href={item.href}>{content}</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </>
      ) : (
        <BreadcrumbPage>{content}</BreadcrumbPage>
      )}
    </BreadcrumbItem>
  );
};
