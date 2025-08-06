"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";

interface ErrorUIProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const ErrorUI = ({ error, reset }: ErrorUIProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Badge variant="destructive" className="text-lg px-3 py-1">
              <AlertTriangle className="mr-1 h-4 w-4" />
              Error
            </Badge>
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest && (
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Error ID:</strong> {error.digest}
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <div className="flex flex-col gap-3">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <Alert className="mt-4">
              <AlertDescription className="text-xs font-mono break-all">
                <strong>Dev Error:</strong> {error.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
