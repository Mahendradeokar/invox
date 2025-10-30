import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customize Invoice Template | Invox",
  description:
    "This page helps you customize your invoice template using AI. Interact with the assistant to modify and personalize your invoice project in Invox.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="viewport-height">
      <div className="md:hidden bg-white/90 flex flex-col items-center justify-center text-center px-6 py-3 border-b border-gray-200">
        <div className="text-base font-semibold mb-1">Please use a desktop</div>
        <div className="text-xs text-gray-600">
          This application is best experienced on a larger screen. Please switch
          to a desktop.
        </div>
      </div>
      <div className="h-full">{children}</div>
    </main>
  );
}
