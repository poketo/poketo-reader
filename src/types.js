export type SiteId =
  | 'helvetica-scans'
  | 'jaiminis-box'
  | 'manga-here'
  | 'manga-updates'
  | 'mangadex'
  | 'mangakakalot'
  | 'meraki-scans';

// Component of a url (eg. "senryu-girl", "5", "en/0/1")
export type Slug = string;
// Full ID of a series/chapter (eg. "meraki-scans:senryu-girl:5")
export type Id = string;

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
  lastReadAt: number,
  linkTo: ?string,
};

export type Collection = {
  slug: string,
  bookmarks: Bookmark[],
};
