import { FC, PropsWithChildren } from 'react';

import { AuthStatus } from '@/frontend/features/auth';
import { Header } from '@/frontend/features/header';

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header rightActions={<AuthStatus />} />
      {children}
    </>
  );
};

export default AdminLayout;
