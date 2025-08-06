"use client";

import { useError } from "~/hooks/use-error";
import { ErrorUI } from "~/components/shared";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useError({ error, logPrefix: "Global" });
  return (
    <html>
      <body>
        <ErrorUI error={error} reset={reset} />
      </body>
    </html>
  );
}
