import { useEffect } from "react";

export const useError = ({
  error,
  logPrefix,
}: {
  error: Error & { digest?: string };
  logPrefix: string;
}) => {
  useEffect(() => {
    console.error(`${logPrefix} application error:`, error);
  }, [error, logPrefix]);
};
