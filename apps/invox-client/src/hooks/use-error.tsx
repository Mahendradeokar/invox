import { useEffect } from "react";

export const useError = ({
  error,
  logPrefix,
}: {
  error: Error & { digest?: string };
  logPrefix: string;
}) => {
  useEffect(() => {
    // If need to call the other service for error log
    console.error(`${logPrefix} application error:`, error);
  }, [error, logPrefix]);
};
