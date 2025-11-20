import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNewsList, getNewsPost } from '@/lib/data';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getNewsList();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const post = await getNewsPost(params.slug).catch(() => null);
  if (!post) return {};
  return {
    title: `${post.title} | SNU Photonics Lab`,
    description: post.summary
  };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const post = await getNewsPost(params.slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/news" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to news
      </Link>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {new Date(post.date).toLocaleDateString('ko-KR')}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">{post.title}</h1>
        {post.author && <p className="text-gray-600">by {post.author}</p>}
        {post.tags && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            {post.tags.map((tag: string) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
