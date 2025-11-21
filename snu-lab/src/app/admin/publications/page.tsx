"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FormState = {
  id?: number;
  title: string;
  authors: string;
  venue: string;
  year: string;
  type: string;
  doi: string;
  link: string;
  volume: string;
  issue: string;
  pages: string;
  summary: string;
};

const initialState: FormState = {
  title: '',
  authors: '',
  venue: '',
  year: '',
  type: '',
  doi: '',
  link: '',
  volume: '',
  issue: '',
  pages: '',
  summary: ''
};

export default function AdminPublicationsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [list, setList] = useState<Publication[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 토큰 검증: 페이지 진입 시마다 확인
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin/auth/check', { method: 'GET' });
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
      } catch {
        router.push('/admin/login');
        return;
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [router]);

  useEffect(() => {
    if (!checking) {
      loadList();
    }
  }, [checking]);

  const loadList = async () => {
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/publications');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '불러오기에 실패했습니다.');
      setList(data.publications ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '불러오기에 실패했습니다.';
      setFetchError(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const authorsArray = form.authors
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        authors: authorsArray,
        year: form.year ? Number(form.year) : null
      };

      const res = await fetch(
        form.id ? `/api/admin/publications/${form.id}` : '/api/admin/publications',
        {
          method: form.id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setMessage(`Saved: #${data.publication.id} ${data.publication.title}`);
      setForm(initialState);
      loadList();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pub: Publication) => {
    setForm({
      id: pub.id,
      title: pub.title,
      authors: pub.authors.join(', '),
      venue: pub.venue ?? '',
      year: pub.year ? String(pub.year) : '',
      type: pub.type ?? '',
      doi: pub.doi ?? '',
      link: pub.link ?? '',
      volume: pub.volume ?? '',
      issue: pub.issue ?? '',
      pages: pub.pages ?? '',
      summary: pub.summary ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`정말 #${id} 항목을 삭제할까요?`)) return;
    try {
      const res = await fetch(`/api/admin/publications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage(`Deleted #${id}`);
      loadList();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      setError(msg);
    }
  };

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (!res.ok) throw new Error('로그아웃에 실패했습니다.');
      window.location.href = '/admin/login';
    } catch (err) {
      const msg = err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
      setLogoutError(msg);
    }
  };

  if (checking) {
    return (
      <section className="mx-auto max-w-3xl p-6 text-center text-sm text-gray-500">
        Checking session...
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-gray-500">Admin</p>
        <h1 className="text-3xl font-semibold">Add Publication</h1>
        <p className="text-gray-600">Comma로 구분된 저자 목록을 입력하고 필요한 필드를 채운 뒤 저장하세요.</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-indigo-600 hover:underline"
          >
            Logout
          </button>
          {logoutError && <span className="text-xs text-red-600">{logoutError}</span>}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-5 shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Authors * (comma separated)</label>
          <input
            name="authors"
            value={form.authors}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Type</label>
            <input name="type" value={form.type} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Year</label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              type="number"
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">DOI</label>
            <input name="doi" value={form.doi} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Link</label>
            <input name="link" value={form.link} onChange={handleChange} className="w-full rounded border px-3 py-2" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Volume / Issue / Pages</label>
            <input
              name="volume"
              placeholder="Volume"
              value={form.volume}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 mb-2"
            />
            <input
              name="issue"
              placeholder="Issue"
              value={form.issue}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 mb-2"
            />
            <input
              name="pages"
              placeholder="Pages"
              value={form.pages}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Summary</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            rows={4}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : form.id ? 'Update Publication' : 'Save Publication'}
          </button>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>

      <section className="space-y-3 rounded-2xl border p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Existing Publications</h2>
        {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
        <div className="space-y-2">
          {list.map((pub) => (
            <div key={pub.id} className="flex items-start justify-between gap-3 rounded border p-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">#{pub.id}</p>
                <p className="font-semibold text-gray-900">{pub.title}</p>
                <p className="text-gray-700">{pub.authors.join(', ')}</p>
                {pub.year && <p className="text-gray-500">{pub.year}</p>}
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(pub)}
                  className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(pub.id)}
                  className="rounded border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-gray-500">No publications yet.</p>}
        </div>
      </section>
    </section>
  );
}
