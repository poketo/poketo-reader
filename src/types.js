import type { ChapterMetadata } from 'poketo';

export type BookmarkLastReadChapterId = string | null;

export type Bookmark = {
  id: string,
  lastReadChapterId: BookmarkLastReadChapterId,
  url: string,
  linkTo: ?string,
};

export type FeedItem = {
  linkTo?: string,
  lastReadAt: number,
  chapters: ChapterMetadata[],
  series: Series,
};

export type Collection = {
  slug: string,
  bookmarks: { [id: string]: Bookmark },
};
