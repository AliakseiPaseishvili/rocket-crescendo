import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "radix-ui";
import { ComponentProps, FC } from "react";

import { cn } from "@/frontend/lib/utils";

const Breadcrumb: FC<ComponentProps<"nav">> = ({ ...props }) => (
  <nav aria-label="breadcrumb" {...props} />
);

const BreadcrumbList: FC<ComponentProps<"ol">> = ({ className, ...props }) => (
  <ol
    className={cn(
      "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
);

const BreadcrumbItem: FC<ComponentProps<"li">> = ({ className, ...props }) => (
  <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />
);

type BreadcrumbLinkProps = ComponentProps<"a"> & { asChild?: boolean };

const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({
  asChild,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
};

const BreadcrumbPage: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
);

const BreadcrumbSeparator: FC<ComponentProps<"span">> = ({
  children,
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </span>
);

const BreadcrumbEllipsis: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
