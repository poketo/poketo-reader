// @flow

export type BookmarkLastReadChapterId = string | null;
export type Bookmark = {
  id: string,
  title: string | null,
  description: string | null,
  coverImageUrl: string | null,
  lastReadChapterId: BookmarkLastReadChapterId,
  lastReadAt: number | null,
  url: string,
  linkTo?: string,
};
