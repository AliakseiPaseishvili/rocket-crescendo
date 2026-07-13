import { Suspense } from 'react';

import { SignInForm } from '@/frontend/features/auth';

const SignInPage = () => {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
};

export default SignInPage;
