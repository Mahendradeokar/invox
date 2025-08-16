import { ErrorResponse } from "@repo/shared-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorResult(error: ErrorResponse) {
  return Promise.resolve({ error } as { error: ErrorResponse; data?: never });
}
