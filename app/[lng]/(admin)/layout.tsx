import { FC, PropsWithChildren } from 'react';

import { Header } from '@/frontend/features/header';

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header/>
      {children}
    </>
  );
};

export default AdminLayout;
