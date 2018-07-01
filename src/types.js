export type Page = {
  id: string,
  url: string,
  width?: number,
  height?: number,
};

export type ChapterMetadata = {
  id: string,
  seriesId: string,
  createdAt: number,
};

export type Chapter = {
  ...ChapterMetadata,
  url: string,
  pages: Array<Page>,
};

export type Series = {
  id: string,
  slug: string,
  title: string,
  url: string,
  siteName: string,
  chapters?: Array<Chapter | ChapterMetadata>,
  linkTo?: string,
  updatedAt: number,
  supportsReading: boolean,
};

export type Bookmark = {
  id: string,
  lastReadAt: number,
  linkTo: ?string,
};

export type Collection = {
  slug: string,
  bookmarks: Bookmark[],
};
