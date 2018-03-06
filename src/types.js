export type Page = {
  id: string,
  url: string,
  width?: number,
  height?: number,
};

export type ChapterPreview = {
  id: string,
  seriesId: string,
  createdAt: number,
};

export type Chapter = {
  ...ChapterPreview,
  sourceUrl: string,
  pages: Array<Page>,
};

export type Series = {
  slug: string,
  title: string,
  chapters: ?Array<Chapter>,
  linkTo: ?string,
  updatedAt: number,
};
