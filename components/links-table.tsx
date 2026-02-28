"use client";

type LinkItem = {
  id: string;
  slug: string;
  shortUrl: string;
  resolvedUrl: string;
  type: string;
  clicks: number;
  isActive: boolean;
};

export function LinksTable({ links }: { links: LinkItem[] }) {
  async function deactivate(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <section className="card">
      <h1>Linklerim</h1>
      <div className="table-wrap">
        <table className="links-table">
          <thead>
            <tr>
              <th>Kısa Link</th>
              <th>Tür</th>
              <th>Tıklama</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td data-label="Kısa Link" className="links-table-url">{link.shortUrl}</td>
                <td data-label="Tür">{link.type}</td>
                <td data-label="Tıklama">{link.clicks}</td>
                <td data-label="Durum">{link.isActive ? "Aktif" : "Pasif"}</td>
                <td data-label="İşlemler" className="links-table-actions">
                  <a className="action-pill" href={`/panel/links/${link.id}`}>Düzenle</a>
                  <a className="action-pill" href={`/panel/analytics/${link.id}`}>Analiz</a>
                  <button className="action-pill danger" onClick={() => deactivate(link.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
