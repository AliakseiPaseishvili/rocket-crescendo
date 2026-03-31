import { FC, ComponentProps } from "react"

import { cn } from "@/frontend/lib/utils"

type SkeletonProps = ComponentProps<"div">

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
