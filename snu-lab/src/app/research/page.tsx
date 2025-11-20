import Image from 'next/image';
import { getResearch } from '@/lib/data';

const imageMap: Record<
  string,
  Array<{
    src: string;
    alt: string;
  }>
> = {
  'topological-nanocavities': [
    { src: '/images/research/TO_1.jpeg', alt: 'Topological nanocavity visualization' }
  ],
  'disorder-random-lasers': [
    { src: '/images/research/DEPC_one.png', alt: 'Disorder-enabled random laser platform' }
  ],
  'maskless-nanofabrication': [
    { src: '/images/research/DMD_1.png', alt: 'DMD-based maskless lithography station' }
  ],
  'resonant-nanophosphors': [
    { src: '/images/research/RC_1.png', alt: 'Resonant cavity phosphor testing' }
  ]
};

export default async function ResearchPage() {
  const projects = await getResearch();
  const preferredOrder = [
    'resonant-nanophosphors',
    'maskless-nanofabrication',
    'topological-nanocavities',
    'disorder-random-lasers'
  ];
  const orderedProjects = [...projects].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a.id);
    const bIndex = preferredOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-widest text-gray-500">Our Latest Research Outputs</p>
        <h1 className="text-4xl font-semibold text-gray-900">Research at μNOEL</h1>
        <p className="text-xl font-medium leading-relaxed text-gray-800">
          The Micro &amp; Nano Opto-Electronics Laboratory (μNOEL) at Seoul National University studies light emission,
          absorption, resonance, and mode control in engineered micro- and nanoscale photonic structures. Our research
          focuses on photonic-crystal-based phenomena and their applications to lasers, light-management structures, and
          high-efficiency optoelectronic devices.
        </p>
      </header>

      <h2 className="text-2xl font-semibold text-gray-900">Research Highlights</h2>

      <div className="grid gap-12">
        {orderedProjects.map((project) => {
          const images = imageMap[project.id] ?? [{ src: '/images/research/research_img01.gif', alt: project.title }];
          const primaryImage = images[0];
          if (!primaryImage) return null;
          const isDisorderProject = project.id === 'disorder-random-lasers';
          const isMasklessProject = project.id === 'maskless-nanofabrication';
          const isTopologicalProject = project.id === 'topological-nanocavities';
          const isResonantProject = project.id === 'resonant-nanophosphors';

          return (
            <article
              key={project.id}
              className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm md:flex md:items-center md:gap-6 md:space-y-0"
            >
              <div className="flex w-full items-center justify-center md:w-2/5">
                <div
                  className={`relative w-full overflow-hidden rounded-3xl ${
                    isDisorderProject || isMasklessProject || isResonantProject || isTopologicalProject
                      ? 'aspect-[4/5]'
                      : 'aspect-[5/3]'
                  }`}
                >
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                    priority={project.id === 'disorder-random-lasers'}
                  />
                </div>
              </div>
              <div className={isResonantProject ? 'md:w-1/2' : 'md:w-3/5'}>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                  <span className="rounded-full border border-gray-300 px-2 py-1">{project.status}</span>
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                      {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold">{project.title}</h2>
                  <p className="mt-3 text-gray-600">{project.summary}</p>
                  <ul className="mt-4 list-inside list-disc text-sm text-gray-600">
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

