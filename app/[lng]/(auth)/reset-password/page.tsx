import { Suspense } from "react";

import { ResetPasswordForm } from "@/frontend/features/auth";

const ResetPasswordPage = () => {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
