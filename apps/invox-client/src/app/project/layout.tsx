export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="viewport-height">
      <div className="h-full max-w-200 mx-auto">{children}</div>
    </main>
  );
}
