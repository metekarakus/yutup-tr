import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PanelLinkForm } from "@/components/panel-link-form";

export default async function PanelOlusturPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/giris");

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { customSlugQuotaUsed: true } });

  return (
    <main className="page-wrap">
      <div className="container">
        <PanelLinkForm customSlugQuotaUsed={user?.customSlugQuotaUsed ?? 0} customSlugQuotaLimit={5} />
      </div>
    </main>
  );
}
