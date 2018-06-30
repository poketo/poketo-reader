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
