import React from "react";

export const AuthorFooter = () => {
  return (
    <footer className="w-full border-t py-4 px-6 bg-background text-center">
      <span className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Invox. Built by Your Mahendra Devkar.
      </span>
    </footer>
  );
};
