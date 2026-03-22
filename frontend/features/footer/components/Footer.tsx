'use client';

import { useTranslation } from 'react-i18next';

import { CONTACT_EMAIL } from '../constants';

export const Footer = () => {
  const { t } = useTranslation('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {/* About Wigmage */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">{t('company')}</h3>
          <p className="leading-relaxed">{t('companyDescription')}</p>
          <p>
            {t('contact')}:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        {/* Privacy & Consent */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">{t('privacyPolicy')}</h3>
          <p className="leading-relaxed">{t('privacyPolicyContent')}</p>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">{t('links')}</h3>
          <ul className="space-y-1">
            <li>
              <a href="#hero" className="underline underline-offset-4 hover:text-foreground transition-colors">
                {t('aboutCompany')}
              </a>
            </li>
            <li>
              <a href="#support" className="underline underline-offset-4 hover:text-foreground transition-colors">
                {t('termsOfService')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40 px-6 py-4">
        <div className="mx-auto max-w-6xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', { year })}</p>
          <p className="text-xs">{t('consent')}</p>
        </div>
      </div>
    </footer>
  );
};
