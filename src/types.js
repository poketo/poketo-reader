import type { ChapterMetadata } from 'poketo';

export type HomeTabId = 'now-reading' | 'library';

export type PageDimensions = {
  width: number,
  height: number,
};

export type FeedItem = {
  linkTo?: string,
  lastReadChapterId: BookmarkLastReadChapterId,
  title: string,
  chapters: ChapterMetadata[],
  series: Series,
};

export type Collection = {
  slug: string,
  bookmarks: { [id: string]: Bookmark },
};
