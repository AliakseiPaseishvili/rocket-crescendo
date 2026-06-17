import { Suspense } from "react";

import { SubscribeConfirmView } from "@/frontend/features/subscription";

export default function SubscribeConfirmPage() {
  return (
    <main className="flex w-full justify-center px-4 py-16">
      <Suspense>
        <SubscribeConfirmView />
      </Suspense>
    </main>
  );
}
