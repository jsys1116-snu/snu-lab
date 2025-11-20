import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { NewsMeta, NewsPost, PeopleData, PublicationList, ResearchProject } from './types';
import { normalizeBibEntry, type RawBibEntry } from './publications';
import { supabase } from './supabaseClient';

const rootPath = process.cwd();
const dataPath = path.join(rootPath, 'src', 'data');
const contentPath = path.join(rootPath, 'src', 'content');

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(dataPath, relativePath);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function getPeople(): Promise<PeopleData> {
  return readJsonFile<PeopleData>('people.json');
}

export async function getResearch(): Promise<ResearchProject[]> {
  return readJsonFile<ResearchProject[]>('research.json');
}

async function loadBibtex(): Promise<PublicationList> {
  const bibPath = path.join(contentPath, 'publications', 'publications.bib');
  const raw = await fs.readFile(bibPath, 'utf-8');
  const bibtexParse = await import('bibtex-parse-js');
  const entries = bibtexParse.toJSON(raw) as RawBibEntry[];
  return entries.map(normalizeBibEntry);
}

export async function getPublications(): Promise<PublicationList> {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as PublicationList;
  } catch {
    // Fallback to local BibTeX parsing if Supabase is unreachable
    return loadBibtex();
  }
}

export async function getNewsList(): Promise<NewsMeta[]> {
  const newsDir = path.join(contentPath, 'news');
  const entries = await fs.readdir(newsDir);

  const posts = await Promise.all(
    entries
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(newsDir, file);
        const raw = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(raw);
        return {
          slug,
          title: data.title as string,
          date: data.date as string,
          summary: (data.summary as string) ?? content.slice(0, 140),
          author: data.author as string | undefined,
          tags: data.tags as string[] | undefined
        } satisfies NewsMeta;
      })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsPost(slug: string): Promise<NewsPost> {
  const filePath = path.join(contentPath, 'news', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: (data.summary as string) ?? '',
    author: data.author as string | undefined,
    tags: data.tags as string[] | undefined,
    contentHtml
  };
}
