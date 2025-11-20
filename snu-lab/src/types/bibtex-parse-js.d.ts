declare module 'bibtex-parse-js' {
  type Entry = {
    citationKey: string;
    entryTags: Record<string, string | undefined>;
  };

  interface BibtexParse {
    toJSON(input: string): Entry[];
  }

  const bibtexParse: BibtexParse;
  export = bibtexParse;
}
