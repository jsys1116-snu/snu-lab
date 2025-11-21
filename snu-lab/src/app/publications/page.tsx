import { getPublications } from "@/lib/data";

type PublicationListType = Awaited<ReturnType<typeof getPublications>>;

function groupByYear(records: PublicationListType) {
  return records.reduce((acc: Record<string, PublicationListType>, pub: PublicationListType[number]) => {
    const key = pub.year ? String(pub.year) : "Unsorted";
    if (!acc[key]) acc[key] = [];
    acc[key].push(pub);
    return acc;
  }, {} as Record<string, PublicationListType>);
}

export default async function PublicationsPage() {
  const publications = await getPublications();
  // Map id (string|number) -> display index (continuous descending order)
  const displayMap = new Map<string, number>();
  publications.forEach((pub, idx) => {
    displayMap.set(String(pub.id), publications.length - idx);
  });

  const grouped = groupByYear(publications);
  const numericYears = Object.keys(grouped).filter((key) => key !== "Unsorted");
  const years = numericYears
    .map((year) => Number(year))
    .filter((year) => !Number.isNaN(year))
    .sort((a, b) => b - a)
    .map((year) => String(year));
  if (grouped["Unsorted"]) {
    years.push("Unsorted");
  }

  return (
    <section className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-widest text-gray-500">Our Latest Research Outputs</p>
        <h1 className="mt-2 text-3xl font-semibold">Publications</h1>
        <p className="mt-2 text-gray-600">저널, 컨퍼런스, 특허 등 μNOEL의 연구 결과를 한눈에 볼 수 있습니다.</p>
      </header>

      {years.map((yearKey) => (
        <div key={yearKey} className="space-y-4">
          <h2 className="text-2xl font-semibold">{yearKey === "Unsorted" ? "Unsorted" : yearKey}</h2>
          <div className="space-y-4">
            {grouped[yearKey]?.map((pub: PublicationListType[number]) => {
              const displayNumber = displayMap.get(String(pub.id)) ?? Number(pub.id) ?? 0;
              return (
                <article key={pub.id} className="rounded-2xl border p-5">
                  {pub.type && <p className="text-xs uppercase tracking-wide text-gray-500">{pub.type}</p>}
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    <span className="mr-2 text-sm font-medium text-gray-500">#{displayNumber}</span>
                    {pub.title}
                  </h3>
                  {pub.authors.length > 0 && <p className="text-sm text-gray-600">{pub.authors.join(', ')}</p>}
                  {pub.venue && <p className="text-sm text-gray-600 italic">{pub.venue}</p>}
                  {pub.citation && <p className="text-xs text-gray-500">{pub.citation}</p>}
                  {pub.summary && <p className="mt-2 text-sm text-gray-600">{pub.summary}</p>}
                  <div className="mt-2 text-sm">
                    {(() => {
                      const href = pub.doi
                        ? pub.doi.startsWith("http")
                          ? pub.doi
                          : `https://doi.org/${pub.doi}`
                        : pub.link;
                      if (!href) return null;
                      return (
                        <a href={href} className="text-indigo-600 hover:underline">
                          View detail
                        </a>
                      );
                    })()}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
