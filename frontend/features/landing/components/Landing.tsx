import { LandingSection } from './LandingSection';

export const Landing = () => {
  return (
    <>
      <LandingSection id="hero" titleKey="hero" />
      <LandingSection id="shop" titleKey="shop" />
      <LandingSection id="game" titleKey="game" />
      <LandingSection id="about" titleKey="aboutUs" />
      <LandingSection id="support" titleKey="support" />
    </>
  );
};
