"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/convex-error";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md surface-card p-8 text-center space-y-4">
        <h2 className="text-headline-3 text-foreground">Something went wrong</h2>
        <p className="text-caption text-muted-foreground">
          {getErrorMessage(error, "A request failed. Please try again.")}
        </p>
        <Button onClick={reset} className="w-full h-11">
          Try again
        </Button>
      </div>
    </div>
  );
}
