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
  id: string,
  slug: string,
  title: string,
  sourceUrl: string,
  siteName: string,
  chapters: ?Array<Chapter>,
  linkTo: ?string,
  updatedAt: number,
};

export type Collection = {
  slug: string,
  series: {
    [seriesId: string]: {
      lastReadAt: number,
      linkTo: ?string,
    },
  },
};
