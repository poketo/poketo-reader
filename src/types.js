export type TraeResponse = {
  config: {
    headers: Object,
    method: string,
    url: string,
  },
  data: any,
  headers: Headers,
  status: number,
  statusText: string,
};

export type TraeError = {
  ...TraeResponse,
  message: string,
};

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
  url: string,
  pages: Array<Page>,
};

export type Series = {
  id: string,
  slug: string,
  title: string,
  url: string,
  siteName: string,
  chapters?: Array<Chapter | ChapterPreview>,
  linkTo?: string,
  updatedAt: number,
  supportsReading: boolean,
};

export type Bookmark = {
  lastReadAt: number,
  linkTo: ?string,
};

export type Collection = {
  slug: string,
  bookmarks: {
    [seriesId: string]: Bookmark,
  },
};
