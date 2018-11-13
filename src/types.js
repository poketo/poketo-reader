import type { ChapterMetadata } from 'poketo';

export type HomeTabId = 'now-reading' | 'library';

export type FeedItem = {
  linkTo?: string,
  lastReadChapterId: BookmarkLastReadChapterId,
  chapters: ChapterMetadata[],
  series: Series,
};

export type Collection = {
  slug: string,
  bookmarks: { [id: string]: Bookmark },
};
