"use client";

import { useMemo } from "react";

import { Avatar, AvatarFallback } from "@/frontend/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";

import { useSession } from "../auth-client";
import { getAvatarFallback } from "../utils";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export const AuthStatus = () => {
  const { data: session } = useSession();

  const fallback = useMemo(
    () => getAvatarFallback(session?.user ?? {}),
    [session?.user],
  );

  if (!session?.user) {
    return <SignInButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          {session.user.username && (
            <span className="text-sm font-medium">
              @{session.user.username}
            </span>
          )}
          {(session.user.name || session.user.lastName) && (
            <span className="text-xs font-normal text-muted-foreground">
              {[session.user.name, session.user.lastName]
                .filter(Boolean)
                .join(" ")}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
