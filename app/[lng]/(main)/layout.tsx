import { CartButton } from '@/frontend/features/cart';
import { Footer } from '@/frontend/features/footer';
import { Header } from '@/frontend/features/header';
import { NavMenu } from '@/frontend/features/nav';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header navItems={<NavMenu />} rightActions={<CartButton />} />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
