import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinksTable } from "@/components/links-table";
import { normalizeBaseUrl } from "@/lib/url";

export default async function PanelLinksPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/giris");

  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
  const links = await prisma.link.findMany({
    where: { ownerUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { clickEvents: true } } }
  });

  return (
    <main className="page-wrap">
      <div className="container">
        <LinksTable
          links={links.map((link) => ({
            id: link.id,
            slug: link.slug,
            shortUrl: `${baseUrl}/r/${link.slug}`,
            resolvedUrl: link.resolvedUrl,
            type: link.type,
            clicks: link._count.clickEvents,
            isActive: link.isActive
          }))}
        />
      </div>
    </main>
  );
}
