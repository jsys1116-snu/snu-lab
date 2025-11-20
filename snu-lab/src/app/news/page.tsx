import Link from 'next/link';
import { getNewsList } from '@/lib/data';

export default async function NewsPage() {
  const posts = await getNewsList();

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-gray-500">News &amp; Updates</p>
        <h1 className="mt-2 text-3xl font-semibold">Recent highlights</h1>
        <p className="mt-2 text-gray-600">
          현재 등록된 게시글이 없습니다. 새 공지를 작성하면 이 영역에 자동으로 표시됩니다.
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl border p-5 transition hover:border-gray-400">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              <Link href={`/news/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600">{post.summary}</p>
            {post.tags && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-1">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
        {!posts.length && <p className="text-sm text-gray-500">등록된 소식이 없습니다.</p>}
      </div>
    </section>
  );
}
