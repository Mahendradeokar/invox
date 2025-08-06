import Link from "next/link";

/**
 * Playing to add landing page here by full vibe coding
 * main code starts at app/app/page.tsx
 *
 */
export const metadata = {
  title: "App",
};

export default function EntryPage() {
  return (
    <div className="container">
      <p className="description">
        Go to
        <Link href="/app">App</Link>
      </p>
    </div>
  );
}
