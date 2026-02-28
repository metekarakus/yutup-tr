type Metrics = {
  totalLinks: number;
  totalClicks: number;
  mobileAttemptRate: number;
  dailyClicks: { day: string; clicks: number }[];
  deviceDistribution: { deviceType: string; clicks: number }[];
};

export function DashboardCards({ metrics }: { metrics: Metrics }) {
  return (
    <section className="metrics-grid">
      <article className="metric-card">
        <h2>Toplam Link</h2>
        <p>{metrics.totalLinks}</p>
      </article>
      <article className="metric-card">
        <h2>Toplam Tiklama</h2>
        <p>{metrics.totalClicks}</p>
      </article>
      <article className="metric-card">
        <h2>Mobil App Deneme Orani</h2>
        <p>%{metrics.mobileAttemptRate}</p>
      </article>

      <article className="metric-card wide">
        <h2>Gunluk Tiklama</h2>
        <ul>
          {metrics.dailyClicks.length === 0 ? <li>Veri yok</li> : null}
          {metrics.dailyClicks.map((item) => (
            <li key={item.day}>
              {item.day}: {item.clicks}
            </li>
          ))}
        </ul>
      </article>

      <article className="metric-card wide">
        <h2>Cihaz Dagilimi</h2>
        <ul>
          {metrics.deviceDistribution.map((item) => (
            <li key={item.deviceType}>
              {item.deviceType}: {item.clicks}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
