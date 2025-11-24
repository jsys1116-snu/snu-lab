import Link from 'next/link';
import { getNewsList, getPeople, getPublications } from '@/lib/data';
import type { Person, PublicationRecord } from '@/lib/types';

type PeopleEntry = Person;
type PublicationEntry = PublicationRecord;

export default async function Home() {
  const people = await getPeople();
  const news = await getNewsList();
  const publications = await getPublications();

  const latestNews = news[0];
  const highlightedPeople: PeopleEntry[] = [
    ...people.faculty,
    ...people.phd.slice(0, 2),
    ...people.masters.slice(0, 1)
  ];
  const highlightedPublications: PublicationEntry[] = publications.slice(0, 3);

  return (
    <section className="space-y-10">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 to-indigo-900 p-10 text-white">
        <p className="text-3xl font-semibold tracking-wide text-slate-200">μNOEL · Seoul National University</p>
        <h1 className="mt-3 text-6xl font-semibold leading-tight">Micro &amp; Nano Opto-Electronics Lab</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/people"
            className="rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Meet the team
          </Link>
          <Link
            href="/publications"
            className="rounded-full border border-transparent bg-white px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Browse publications
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-3xl font-semibold text-gray-900">Introduction to μNOEL</h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-800">
          μNOEL, the name of our research group, stands for the Micro and Nano Opto-Electronics Laboratory. We study
          photons, electrons, and their interactions within engineered micro- and nanoscale photonic
          structures—including quantum wells, quantum dots, microcavities, microwaveguides, and nanophotonic structures
          based on photonic crystals. These structures offer scientifically rich platforms where the behaviors of
          electrons and photons can be tailored in ways not possible in natural systems. Our mission is to create such
          engineered environments through advanced micro- and nanofabrication techniques, and to investigate both the
          fundamental physics they reveal and the novel device applications they enable.
        </p>
        <Link href="/research" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">
          Detailed research overview →
        </Link>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-3xl font-semibold text-gray-900">Recent publications</h2>
        <p className="mt-1 text-sm text-gray-600">주요 논문과 컨퍼런스 실적을 빠르게 살펴보세요.</p>
        <div className="mt-4 space-y-4">
          {highlightedPublications.map((pub) => (
            <div key={pub.id}>
              <p className="text-sm text-gray-500">
                {pub.venue} · {pub.year}
              </p>
              <p className="text-base font-semibold text-gray-900">{pub.title}</p>
              <p className="text-sm text-gray-600">{pub.authors.join(', ')}</p>
            </div>
          ))}
        </div>
        <Link href="/publications" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">
          전체 출판물 보기 →
        </Link>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-3xl font-semibold text-gray-900">People</h2>
        <p className="mt-1 text-sm text-gray-600">Micro &amp; Nano Opto-Electronics Lab 구성원을 살펴보세요.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {highlightedPeople.map((person: PeopleEntry) => (
            <div key={person.email ?? person.name} className="rounded-xl border p-4">
              <p className="font-semibold text-gray-900">{person.name}</p>
              <p className="text-sm text-gray-600">{person.title}</p>
              {person.program && <p className="text-xs text-gray-500">{person.program}</p>}
              {person.interests && person.interests.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">Focus: {person.interests.slice(0, 2).join(', ')}</p>
              )}
            </div>
          ))}
        </div>
        <Link href="/people" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">
          전체 구성원 보기 →
        </Link>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-3xl font-semibold text-gray-900">Latest news</h2>
        {latestNews ? (
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {new Date(latestNews.date).toLocaleDateString('ko-KR')}
            </p>
            <p className="font-medium text-gray-900">{latestNews.title}</p>
            <p className="text-gray-600">{latestNews.summary}</p>
            <Link href={`/news/${latestNews.slug}`} className="inline-flex text-indigo-600">
              Read more →
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">등록된 소식이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
