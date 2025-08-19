import { notFound } from "next/navigation";
import { getSharedArtifact } from "~/lib/requests/artifact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Invoice Template | Invox",
  description:
    "View a publicly shared invoice template. This page displays the shared template content for easy viewing and collaboration.",
};

interface SharedPageProps {
  params: Promise<{ sharedToken: string }>;
}

export default async function SharedPage({ params }: SharedPageProps) {
  const { sharedToken } = await params;
  const { data, error } = await getSharedArtifact(sharedToken);

  if (error) {
    if (error.code === "404") {
      notFound();
    }
    throw new Error(error.detail || "Failed to fetch shared artifact");
  }

  if (!data || !data.content) {
    notFound();
  }

  return (
    <div className="flex flex-1 min-h-screen">
      <iframe
        sandbox="allow-same-origin allow-scripts allow-popups"
        srcDoc={data.content}
        className="w-full border-none"
      />
    </div>
  );
}
