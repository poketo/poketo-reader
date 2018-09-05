export type BookmarkLastReadChapterId = string | null;

export type Bookmark = {
  id: string,
  lastReadChapterId: BookmarkLastReadChapterId,
  url: string,
  linkTo: ?string,
};

export type Collection = {
  slug: string,
  bookmarks: { [id: string]: Bookmark },
};
