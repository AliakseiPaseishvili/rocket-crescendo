import { Suspense } from "react";

import { VerifyEmailView } from "@/frontend/features/auth";

const VerifyEmailPage = () => {
  return (
    <Suspense>
      <VerifyEmailView />
    </Suspense>
  );
};

export default VerifyEmailPage;
