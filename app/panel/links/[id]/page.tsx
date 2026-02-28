import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditLinkForm } from "@/components/edit-link-form";

export default async function LinkDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/giris");

  const { id } = await params;
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.ownerUserId !== session.user.id) redirect("/panel/links");

  return (
    <main className="page-wrap">
      <div className="container">
        <EditLinkForm
          id={link.id}
          originalUrl={link.originalUrl}
          type={link.type}
          interstitialEnabled={link.interstitialEnabled}
          interstitialMessage={link.interstitialMessage || ""}
          isActive={link.isActive}
        />
      </div>
    </main>
  );
}
