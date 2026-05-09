import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import { auth } from "@/backend/features/auth";
import { AuthStatus } from "@/frontend/features/auth";
import { Header } from "@/frontend/features/header";

type AdminLayoutProps = PropsWithChildren<{ params: Promise<{ lng: string }> }>;

const AdminLayout: FC<AdminLayoutProps> = async ({ children, params }) => {
  await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    notFound();
  }

  return (
    <>
      <Header rightActions={<AuthStatus />} />
      {children}
    </>
  );
};

export default AdminLayout;
