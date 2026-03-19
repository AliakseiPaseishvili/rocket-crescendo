"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { languageLabels, supportedLngs } from "../constants";
import i18n from "../i18n";
import { useCallback } from "react";

export const LanguageSelector = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const currentLng = language as (typeof supportedLngs)[number];

  const handleChange = useCallback(
    (lng: string) => {
      console.log(lng)
      i18n.changeLanguage(lng);
      const segments = pathname.split("/");
      segments[1] = lng;
      router.push(segments.join("/"));
    },
    [pathname, router],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
        {languageLabels[currentLng] ?? currentLng}
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={currentLng} onValueChange={handleChange}>
          {supportedLngs.map((lng) => (
            <DropdownMenuRadioItem key={lng} value={lng}>
              {languageLabels[lng]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
