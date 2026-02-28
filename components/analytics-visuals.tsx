"use client";

type CountryRow = {
  code: string;
  name: string;
  clicks: number;
};

type CityRow = {
  name: string;
  clicks: number;
};

type Props = {
  countries: CountryRow[];
  cities: CityRow[];
};

export function AnalyticsVisuals({ countries, cities }: Props) {
  const maxCountry = Math.max(1, ...countries.map((c) => c.clicks));
  const maxCity = Math.max(1, ...cities.map((c) => c.clicks));
  const topCountries = countries.slice(0, 6);

  return (
    <div className="analytics-wrap">
      <section className="analytics-card">
        <h3>Dünya Haritası Önizleme</h3>
        <p className="muted">Üst ülkeler ve yoğunluk dağılımı önizlemesi.</p>
        <div className="worldmap-box">
          <img
            className="worldmap-img"
            src="https://commons.wikimedia.org/wiki/Special:FilePath/BlankMap-World-Compact.svg"
            alt="Gerçek dünya haritası önizlemesi"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {topCountries.length > 0 ? (
            <ul className="worldmap-legend">
              {topCountries.map((country) => (
                <li key={`${country.code}-${country.name}`}>
                  <span className="dot" />
                  <span>{country.name}</span>
                  <strong>{country.clicks}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="analytics-grid-2">
        <article className="analytics-card">
          <h3>Ülke Dağılımı</h3>
          <ul className="metric-list">
            {countries.length === 0 ? <li>Veri yok</li> : null}
            {countries.map((item) => (
              <li key={`${item.code}-${item.name}`}>
                <div className="metric-row-head">
                  <span>{item.name}</span>
                  <strong>{item.clicks}</strong>
                </div>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${Math.max(6, (item.clicks / maxCountry) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="analytics-card">
          <h3>Şehir Dağılımı</h3>
          <ul className="metric-list">
            {cities.length === 0 ? <li>Veri yok</li> : null}
            {cities.map((item) => (
              <li key={item.name}>
                <div className="metric-row-head">
                  <span>{item.name}</span>
                  <strong>{item.clicks}</strong>
                </div>
                <div className="metric-bar-track">
                  <div className="metric-bar-fill" style={{ width: `${Math.max(6, (item.clicks / maxCity) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
