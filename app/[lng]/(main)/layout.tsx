import { AuthStatus } from "@/frontend/features/auth";
import { CartButton } from "@/frontend/features/cart";
import { Footer } from "@/frontend/features/footer";
import { Header } from "@/frontend/features/header";
import { NavMenu } from "@/frontend/features/nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header
        navItems={<NavMenu />}
        rightActions={
          <div className="flex flex-row items-center gap-2">
            <CartButton />
            <div className="hidden md:flex">
              <AuthStatus />
            </div>
          </div>
        }
      />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
