export interface Person {
  name: string;
  title: string;
  email?: string;
  website?: string;
  interests?: string[];
  bio?: string;
  program?: string;
  note?: string;
  image?: string;
  period?: string;
  currentAffiliation?: string;
  office?: string;
  address?: string;
  phone?: string;
  fax?: string;
  education?: string[];
  career?: string[];
  labIntro?: string;
}

export interface PeopleData {
  faculty: Person[];
  postdocs: Person[];
  phd: Person[];
  masters: Person[];
  staff: Person[];
  alumni: Person[];
}

export interface ResearchProject {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  tags: string[];
  status: 'Active' | 'Completed' | string;
}

export interface PublicationRecord {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  doi?: string;
  link?: string;
  summary?: string;
  citation?: string;
}

export type PublicationList = PublicationRecord[];

export interface NewsMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  author?: string;
  tags?: string[];
}

export interface NewsPost extends NewsMeta {
  contentHtml: string;
}
