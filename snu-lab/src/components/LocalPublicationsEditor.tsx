"use client";

import { useEffect, useState } from "react";

type Publication = {
  id: number;
  title: string;
  authors: string[];
  venue?: string | null;
  year?: number | null;
  type?: string | null;
  doi?: string | null;
  link?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  summary?: string | null;
};

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
  title: "",
  authors: "",
  venue: "",
  year: "",
  type: "",
  doi: "",
  link: "",
  volume: "",
  issue: "",
  pages: "",
  summary: ""
};

export default function LocalPublicationsEditor() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [list, setList] = useState<Publication[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadList = async () => {
    setFetchError(null);
    try {
      const res = await fetch("/api/local-editor/publications", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setList(data.publications ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load";
      setFetchError(msg);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const displayMap = new Map<number, number>();
  list.forEach((pub, idx) => {
    displayMap.set(pub.id, list.length - idx);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const authorsArray = form.authors
        .split(",")
        .map((author) => author.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        authors: authorsArray,
        year: form.year ? Number(form.year) : null
      };

      const res = await fetch(
        form.id ? `/api/local-editor/publications/${form.id}` : "/api/local-editor/publications",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setMessage(`Saved: ${data.publication.title}`);
      resetForm();
      loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pub: Publication) => {
    setForm({
      id: pub.id,
      title: pub.title,
      authors: pub.authors.join(", "),
      venue: pub.venue ?? "",
      year: pub.year ? String(pub.year) : "",
      type: pub.type ?? "",
      doi: pub.doi ?? "",
      link: pub.link ?? "",
      volume: pub.volume ?? "",
      issue: pub.issue ?? "",
      pages: pub.pages ?? "",
      summary: pub.summary ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const displayNumber = displayMap.get(id) ?? id;
    if (!confirm(`Delete publication #${displayNumber}?`)) return;

    try {
      const res = await fetch(`/api/local-editor/publications/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setMessage(`Deleted #${displayNumber}`);
      loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-gray-500">Local Only</p>
        <h1 className="text-3xl font-semibold">Publications Editor</h1>
        <p className="text-gray-600">
          This page works only on localhost and writes directly to the Supabase publications table.
        </p>
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
              className="mb-2 w-full rounded border px-3 py-2"
            />
            <input
              name="issue"
              placeholder="Issue"
              value={form.issue}
              onChange={handleChange}
              className="mb-2 w-full rounded border px-3 py-2"
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
            {loading ? "Saving..." : form.id ? "Update Publication" : "Save Publication"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>

      <section className="space-y-3 rounded-2xl border p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Existing Publications</h2>
        {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
        <div className="space-y-2">
          {list.map((pub) => {
            const displayNumber = displayMap.get(pub.id) ?? pub.id;
            return (
            <div key={pub.id} className="flex items-start justify-between gap-3 rounded border p-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">#{displayNumber}</p>
                <p className="font-semibold text-gray-900">{pub.title}</p>
                <p className="text-gray-700">{pub.authors.join(", ")}</p>
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
            );
          })}
          {list.length === 0 && <p className="text-sm text-gray-500">No publications yet.</p>}
        </div>
      </section>
    </section>
  );
}
