import { HeroSection } from './HeroSection';
import { LandingSection } from './LandingSection';
import { ShopSection } from './ShopSection';
import { SubscribeSection } from './SubscribeSection';

export const Landing = () => {
  return (
    <>
      <HeroSection/>
      <ShopSection />
      <LandingSection id="game" titleKey="game" />
      <LandingSection id="about" titleKey="aboutUs" />
      <SubscribeSection />
      <LandingSection id="support" titleKey="support" />
    </>
  );
};
