export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen">
      <div className="h-full max-w-200 mx-auto">{children}</div>
    </main>
  );
}
