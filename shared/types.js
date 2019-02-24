// @flow

export type BookmarkLastReadChapterId = string | null;
export type Bookmark = {
  id: string,
  title: string,
  lastReadChapterId: BookmarkLastReadChapterId,
  lastReadAt: number | null,
  url: string,
  linkTo?: string,
};
