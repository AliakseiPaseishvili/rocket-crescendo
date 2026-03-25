import { HeroSection } from './HeroSection';
import { LandingSection } from './LandingSection';
import { ShopSection } from './ShopSection';

export const Landing = () => {
  return (
    <>
      <HeroSection/>
      <ShopSection />
      <LandingSection id="game" titleKey="game" />
      <LandingSection id="about" titleKey="aboutUs" />
      <LandingSection id="support" titleKey="support" />
    </>
  );
};
