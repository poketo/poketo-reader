// @flow

import 'now-env';
import { inherits } from 'util';
import knex from 'knex';
import uuid from 'uuid/v4';
import shortid from 'shortid';
import type { Series } from 'poketo';
import type { Bookmark } from '../../shared/types';
import type { DatabaseBookmark, BookmarkInfo, User } from './types';
import knexfile from '../knexfile';
import utils from './utils';

export const pg = knex(knexfile);

const isPostgresError = err => {
  console.error(err);
  if (err.routine && err.severity) {
    return true;
  }
  return false;
};

const query = promise =>
  promise.catch(err => {
    if (isPostgresError(err)) {
      throw new QueryError(`The Poketo database threw an unknown error.`);
    }
    throw err;
  });

export function NotFoundError(message: string) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.code = 'NOT_FOUND';
  this.message = message;
  this.status = 404;
}

export function QueryError(message: string) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.code = 'QUERY_ERROR';
  this.message = message;
  this.status = 500;
}

inherits(NotFoundError, Error);
inherits(QueryError, Error);

const USER_FIELDS: Array<$Keys<User>> = ['id', 'slug', 'email', 'createdAt'];

const BOOKMARK_FIELDS: Array<$Keys<DatabaseBookmark>> = [
  'id',
  'seriesId',
  'seriesUrl',
  'title',
  'lastReadChapterId',
  'lastReadAt',
  'linkToUrl',
  'createdAt',
];

const PostgresErrorCodes = {
  UNIQUE_VIOLATION: '23505',
};

const createNewDatabaseBookmark = (
  bookmarkInfo: BookmarkInfo,
  userId: string,
) => ({
  // Default new bookmarks to be "last read at" the current time
  lastReadAt: new Date(),
  ...bookmarkInfo,
  id: uuid(),
  ownerId: userId,
});

const toBookmark = (bookmarkData: DatabaseBookmark): Bookmark => {
  const bookmark: Bookmark = {
    id: bookmarkData.seriesId,
    title: bookmarkData.title,
    lastReadChapterId: bookmarkData.lastReadChapterId,
    lastReadAt: bookmarkData.lastReadAt
      ? utils.dateToTimestamp(new Date(bookmarkData.lastReadAt))
      : null,
    url: bookmarkData.seriesUrl,
  };

  if (bookmarkData.linkToUrl) {
    bookmark.linkTo = bookmarkData.linkToUrl;
  }

  return bookmark;
};

async function findBookmarksBySlug(userSlug: string): Promise<Bookmark[]> {
  const result: DatabaseBookmark[] = await query(
    pg('users')
      .where('slug', userSlug)
      .leftJoin('bookmarks', 'bookmarks.ownerId', 'users.id')
      .select(...BOOKMARK_FIELDS.map(field => `bookmarks.${field}`)),
  );

  if (result.length === 0) {
    throw new NotFoundError(`Collection '${userSlug}' not found`);
  }

  return result.map(toBookmark);
}

async function checkBookmarkExists(
  userId: string,
  seriesId: string,
): Promise<boolean> {
  const result = await query(
    pg('users')
      .leftJoin('bookmarks', 'bookmarks.ownerId', 'users.id')
      .where({ 'users.id': userId, 'bookmarks.seriesId': seriesId })
      .select(...BOOKMARK_FIELDS.map(field => `bookmarks.${field}`)),
  );

  if (result) {
    return true;
  }

  return false;
}

async function findUserBySlug(userSlug: string): Promise<User> {
  const result: User | null = await query(
    pg('users')
      .where('slug', userSlug)
      .first(),
  );

  if (!result) {
    throw new NotFoundError(`Collection '${userSlug}' not found`);
  }

  return result;
}

async function insertUser(userInfo: {
  email: string,
  slug?: string,
}): Promise<User> {
  const user = {
    id: uuid(),
    email: userInfo.email,
    slug: userInfo.slug || shortid.generate(),
  };

  const result: User[] = await query(pg('users').insert(user, USER_FIELDS));

  if (result.length === 0) {
    throw new QueryError('Unable to create user');
  }

  return result[0];
}

async function insertBookmark(
  userId: string,
  bookmarkInfo: BookmarkInfo,
): Promise<void> {
  return query(
    pg('bookmarks')
      .insert(createNewDatabaseBookmark(bookmarkInfo, userId))
      .returning('*')
      .catch(err => {
        if (err.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
          throw new QueryError(
            `A bookmark for '${bookmarkInfo.seriesUrl}' already exists`,
          );
        }
        throw err;
      }),
  );
}

async function insertBookmarks(
  userId: string,
  bookmarksInfo: BookmarkInfo[],
): Promise<void> {
  const bookmarks = bookmarksInfo.map(b =>
    createNewDatabaseBookmark(b, userId),
  );

  return query(pg('bookmarks').insert(bookmarks));
}

async function updateBookmark(
  userId: string,
  seriesId: string,
  bookmarkInfo: BookmarkInfo,
): Promise<Bookmark> {
  const result: DatabaseBookmark[] = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesId })
      .first()
      .update(bookmarkInfo, '*'),
  );

  if (result.length === 0) {
    throw new NotFoundError(`Bookmark '${seriesId}' not found`);
  }

  return toBookmark(result[0]);
}

async function deleteBookmark(userId: string, seriesId: string): Promise<void> {
  const result = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesId })
      .del(),
  );

  const bookmarkWasDeleted = result !== 0;

  if (!bookmarkWasDeleted) {
    throw new NotFoundError(`Bookmark '${seriesId}' not found`);
  }
}

export default {
  checkBookmarkExists,
  findBookmarksBySlug,
  findUserBySlug,
  insertUser,
  insertBookmark,
  insertBookmarks,
  updateBookmark,
  deleteBookmark,
};
