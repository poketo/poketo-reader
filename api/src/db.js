// @flow

import 'now-env';
import { inherits } from 'util';
import knex from 'knex';
import knexfile from '../knexfile';
import uuid from 'uuid/v4';
import shortid from 'shortid';
import type { Series } from 'poketo';
import type { Bookmark } from '../../shared/types';
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

const USER_FIELDS = ['id', 'slug', 'email', 'createdAt'];

const BOOKMARK_FIELDS = [
  'id',
  'seriesId',
  'seriesUrl',
  'lastReadChapterId',
  'linkToUrl',
  'createdAt',
];

const PostgresErrorCodes = {
  UNIQUE_VIOLATION: '23505',
};

async function findBookmarksBySlug(userSlug: string): Promise<Bookmark[]> {
  const result: DatabaseBookmark[] = await query(
    pg('users')
      .where('slug', userSlug)
      .leftJoin('bookmarks', 'bookmarks.ownerId', 'users.id')
      .select(...BOOKMARK_FIELDS.map(field => `bookmarks.${field}`)),
  );

  if (result.length < 1) {
    throw new NotFoundError(`Collection '${userSlug}' not found`);
  }

  return result.map(toBookmark);
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

type User = {
  id: string,
  email: string,
  slug: string,
  createdAt?: number,
};

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

  if (result.length < 1) {
    throw new QueryError('Unable to create user');
  }

  return result[0];
}

type BookmarkInfo = {
  seriesId: string,
  seriesUrl: string,
  lastReadChapterId: string | null,
  linkToUrl: string | null,
};

type DatabaseBookmark = {
  id: string,
  ownerId: string,
  seriesId: string,
  seriesUrl: string,
  lastReadChapterId: string | null,
  lastReadAt: string | null,
  linkToUrl: string | null,
  createdAt: string,
};

const toDatabaseBookmark = (bookmarkInfo: BookmarkInfo, userId: string) => ({
  ...bookmarkInfo,
  id: uuid(),
  ownerId: userId,
});

const toBookmark = (bookmarkData: DatabaseBookmark): Bookmark => {
  const bookmark: Bookmark = {
    id: bookmarkData.seriesId,
    lastReadChapterId: bookmarkData.lastReadChapterId,
    lastReadAt: utils.dateToTimestamp(new Date(bookmarkData.createdAt)),
    url: bookmarkData.seriesUrl,
  };

  if (bookmarkData.linkToUrl) {
    bookmark.linkTo = bookmarkData.linkToUrl;
  }

  return bookmark;
};

async function insertBookmark(
  userId: string,
  bookmarkInfo: BookmarkInfo,
): Promise<void> {
  return query(
    pg('bookmarks')
      .insert(toDatabaseBookmark(bookmarkInfo, userId))
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
  const bookmarks = bookmarksInfo.map(b => toDatabaseBookmark(b, userId));

  return query(pg('bookmarks').insert(bookmarks));
}

async function updateBookmark(
  userId: string,
  seriesId: string,
  bookmarkInfo: {
    lastReadChapterId?: string,
    linkToUrl?: string,
  },
): Promise<Bookmark> {
  const result: DatabaseBookmark[] = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesId: seriesId })
      .first()
      .update(bookmarkInfo, '*'),
  );

  if (result.length < 1) {
    throw new NotFoundError(`Bookmark '${seriesId}' not found`);
  }

  return toBookmark(result[0]);
}

async function deleteBookmark(userId: string, seriesId: string): Promise<void> {
  const result = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesId: seriesId })
      .del(),
  );

  const bookmarkWasDeleted = result !== 0;

  if (!bookmarkWasDeleted) {
    throw new NotFoundError(`Bookmark '${seriesId}' not found`);
  }
}

export default {
  findBookmarksBySlug,
  findUserBySlug,
  insertUser,
  insertBookmark,
  insertBookmarks,
  updateBookmark,
  deleteBookmark,
};
