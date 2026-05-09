import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/frontend/constants";
import { Link } from "@/frontend/features/translation/i18n/navigation";

const NotFound = async () => {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-8xl font-bold text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="max-w-md text-muted-foreground">{t("description")}</p>
      <Link
        href={ROUTES.BASE}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {t("goHome")}
      </Link>
    </div>
  );
};

export default NotFound;
