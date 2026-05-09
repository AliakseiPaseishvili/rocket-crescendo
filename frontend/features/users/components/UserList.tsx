"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import { useTranslations } from "next-intl";

import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { DataTable } from "@/frontend/components/ui/data-table";

import { useUsersQuery } from "../hooks";
import { UserActionsCell } from "./UserRow";

export const UserList = () => {
  const t = useTranslations("user");
  const { items, fetchNextPage, queryProps } = useUsersQuery();
  const { isPending, isError, hasNextPage, isFetchingNextPage } = queryProps;

  const columns: ColumnDef<UserWithRole>[] = [
    {
      id: "user",
      header: () => t("user"),
      cell: ({ row }) => {
        const { email } = row.original;
        return (
          <div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        );
      },
    },
    {
      id: "role",
      header: () => t("role"),
      cell: ({ row }) => {
        const isAdmin = row.original.role === "admin";
        return (
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {isAdmin ? t("roleAdmin") : t("roleUser")}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: () => t("status"),
      cell: ({ row }) => {
        const { banned } = row.original;
        return (
          <Badge variant={banned ? "destructive" : "outline"}>
            {banned ? t("banned") : t("active")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("actions")}</div>,
      cell: ({ row }) => (
        <UserActionsCell
          id={row.original.id}
          role={row.original.role ?? "user"}
          banned={row.original.banned}
        />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={items ?? []}
        isLoading={isPending}
        isError={isError}
        loadingFallback={
          <p className="text-muted-foreground">{t("loadingUsers")}</p>
        }
        errorFallback={
          <p className="text-destructive">{t("errorLoadingUsers")}</p>
        }
        emptyFallback={<p className="text-muted-foreground">{t("noUsers")}</p>}
      />
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={fetchNextPage}
          >
            {t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
};
