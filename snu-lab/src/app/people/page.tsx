import { getPeople } from '@/lib/data';
import type { PeopleData, Person } from '@/lib/types';

type SectionKey = keyof PeopleData;
type PersonEntry = Person;

const sections: Array<{ key: SectionKey; title: string; subtitle?: string }> = [
  { key: 'faculty', title: 'Professor' },
  { key: 'postdocs', title: 'Postdoctoral Researchers', subtitle: '포스트닥' },
  { key: 'phd', title: 'Ph.D. Course', subtitle: '박사과정' },
  { key: 'masters', title: 'M.S. Course', subtitle: '석사과정' },
  { key: 'staff', title: 'Staff & Secretary', subtitle: '행정·연구지원' },
  { key: 'alumni', title: 'Alumni', subtitle: '동문' }
];

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <section className="space-y-10">
      <header>
        <p className="text-sm uppercase tracking-widest text-gray-500">Our Team</p>
        <h1 className="mt-2 text-3xl font-semibold">Micro &amp; Nano Opto-Electronics Lab</h1>
      </header>

      {sections.map((section) => {
        const entries = people[section.key] as PersonEntry[];
        if (!entries.length) return null;

        const isPhdSection = section.key === 'phd';
        const isAlumniSection = section.key === 'alumni';
        const isFacultySection = section.key === 'faculty';

        return (
          <div key={String(section.key)} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              {section.subtitle && <p className="text-sm text-gray-500">{section.subtitle}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {entries.map((person: PersonEntry) => {
                const displayTitle = isPhdSection ? 'Ph.D. Candidate' : isAlumniSection ? undefined : person.title;
                const displayProgram = isPhdSection || isAlumniSection ? undefined : person.program;

                if (isFacultySection) {
                  return (
                    <article
                      key={person.email ?? person.name}
                      className="md:col-span-2 flex flex-col gap-6 rounded-2xl border p-6 md:flex-row"
                    >
                      {person.image && (
                        <div className="flex-shrink-0 self-start overflow-hidden rounded-xl border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={person.image}
                            alt={`${person.name} portrait`}
                            className="h-64 w-52 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-2xl font-semibold text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-600">{person.title}</p>
                          {person.currentAffiliation && (
                            <p className="text-sm text-gray-600">{person.currentAffiliation}</p>
                          )}
                          {person.bio && <p className="mt-2 text-sm text-gray-600">{person.bio}</p>}
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          {person.office && <p>Office: {person.office}</p>}
                          {person.address && <p>Address: {person.address}</p>}
                          {(person.phone || person.fax) && (
                            <p>
                              {person.phone && `Tel: ${person.phone}`}
                              {person.phone && person.fax && ' · '}
                              {person.fax && `Fax: ${person.fax}`}
                            </p>
                          )}
                          {person.email && (
                            <p>
                              Email:{' '}
                              <a href={`mailto:${person.email}`} className="text-blue-600 underline-offset-4 hover:underline">
                                {person.email}
                              </a>
                            </p>
                          )}
                        </div>
                        {person.education && person.education.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Education</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                              {person.education.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {person.career && person.career.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                              Professional Career
                            </h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                              {person.career.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {person.interests && person.interests.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                              Research Interests
                            </h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                              {person.interests.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }

                return (
                  <article key={person.email ?? person.name} className="rounded-2xl border p-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-gray-900">{person.name}</p>
                      {displayTitle && <p className="text-sm text-gray-600">{displayTitle}</p>}
                      {displayProgram && <p className="text-xs text-gray-500">{displayProgram}</p>}
                      {person.bio && <p className="text-sm text-gray-500">{person.bio}</p>}
                      {person.interests && person.interests.length > 0 && (
                        <p className="text-xs text-gray-500">Research interests: {person.interests.join(', ')}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        {person.email && (
                          <span className="mr-3">
                            <a href={`mailto:${person.email}`} className="hover:underline">
                              {person.email}
                            </a>
                          </span>
                        )}
                      </div>
                      {section.key === 'faculty' && person.note && (
                        <p className="mt-2 text-sm text-gray-500">{person.note}</p>
                      )}
                      {!isAlumniSection && person.currentAffiliation && (
                        <p className="mt-2 text-sm text-gray-500">
                          Current: {person.currentAffiliation} {person.period && `(${person.period})`}
                        </p>
                      )}
                      {isAlumniSection && person.note && (
                        <p className="mt-2 text-sm text-gray-500">{person.note}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
