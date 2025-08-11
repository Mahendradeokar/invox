import React, { type ReactNode } from "react";

interface TernaryProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const Ternary = ({
  condition,
  children,
  fallback = <React.Fragment />,
}: TernaryProps) => {
  return condition ? children : fallback;
};
