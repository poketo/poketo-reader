export type Bookmark = {
  id: string,
  lastReadChapterId: string | null,
  url: string,
  linkTo: ?string,
};

export type Collection = {
  slug: string,
  bookmarks: { [id: string]: Bookmark },
};
