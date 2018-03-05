
export type Page = {
  id: string,
  url: string,
  width?: number,
  height?: number,
};

export type Chapter = {
  id: string,
  seriesId: string,
  sourceUrl: string,
  createdAt: number,
  pages: Array<Page>,
}

export type Series = {
  slug: string,
  title: string,
  chapters: Array<Chapter>,
  updatedAt: number,
};
