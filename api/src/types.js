// @flow

export type User = {
  id: string,
  email: string,
  slug: string,
  createdAt?: number,
};

export type DatabaseBookmark = {|
  id: string,
  ownerId: string,
  seriesId: string,
  seriesUrl: string,
  title: string | null,
  lastReadChapterId: string | null,
  lastReadAt: string | null,
  linkToUrl: string | null,
  createdAt: string,
|};

type UneditableDatabaseBookmarkFields = {
  id: string,
  ownerId: string,
  createdAt: string,
};

export type BookmarkInfo = $Shape<
  $Diff<DatabaseBookmark, UneditableDatabaseBookmarkFields>,
>;
