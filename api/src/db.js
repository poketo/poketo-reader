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
  if (err.routine && err.severity) {
    return true;
  }
  return false;
};

const query = promise =>
  promise.catch(err => {
    console.log(err);
    if (isPostgresError(err)) {
      throw new QueryError(`The Poketo database threw an error.`);
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
  'seriesPid',
  'seriesUrl',
  'lastReadChapterPid',
  'linkToUrl',
  'createdAt',
];

const PostgresErrorCodes = {
  UNIQUE_VIOLATION: '23505',
};

async function findBookmarksBySlug(userSlug: string): Promise<Bookmark[]> {
  const result = await query(
    pg('users')
      .where('slug', userSlug)
      .leftJoin('bookmarks', 'bookmarks.ownerId', 'users.id')
      .select(...BOOKMARK_FIELDS.map(field => `bookmarks.${field}`)),
  );

  if (result.length < 1) {
    throw new NotFoundError(`Collection '${userSlug}' not found`);
  }

  return result;
}

async function findUserBySlug(userSlug: string): Promise<User> {
  const result = await query(
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
  slug: string | null,
  createdAt?: number,
};

async function insertUser(userInfo: { email: string, slug?: string }) {
  const user = {
    id: uuid(),
    email: userInfo.email,
    slug: userInfo.slug || shortid.generate(),
  };

  const result = await query(pg('users').insert(user, USER_FIELDS));
  return result[0];
}

type BookmarkInfo = {
  seriesPid: string,
  seriesUrl: string,
  lastReadChapterPid: string | null,
  linkToUrl: string | null,
};

const toBookmark = (bookmarkInfo: BookmarkInfo, userId: string) => ({
  ...bookmarkInfo,
  id: uuid(),
  ownerId: userId,
});

async function insertBookmark(userId: string, bookmarkInfo: BookmarkInfo) {
  const result = await query(
    pg('bookmarks')
      .insert(toBookmark(bookmarkInfo, userId))
      .returning('*')
      .catch(err => {
        if (
          err.code === PostgresErrorCodes.UNIQUE_VIOLATION &&
          err.constraint === 'bookmarks_seriespid_unique'
        ) {
          throw new Error(
            `A bookmark for '${bookmarkInfo.seriesUrl}' already exists!`,
          );
        }
        throw err;
      }),
  );

  return result;
}

async function insertBookmarks(userId: string, bookmarksInfo: BookmarkInfo[]) {
  const bookmarks = bookmarksInfo.map(b => toBookmark(b, userId));
  const result = await query(pg('bookmarks').insert(bookmarks));

  return result;
}

async function updateBookmark(
  userId: string,
  seriesId: string,
  bookmarkInfo: {
    lastReadChapterPid?: string,
    linkToUrl?: string,
  },
) {
  const result = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesPid: seriesId })
      .first()
      .update(bookmarkInfo, '*'),
  );

  if (result.length < 1) {
    throw new NotFoundError(`Bookmark '${seriesId}' not found`);
  }

  return result[0];
}

async function deleteBookmark(userId: string, seriesId: string): Promise<void> {
  const result = await query(
    pg('bookmarks')
      .where({ ownerId: userId, seriesPid: seriesId })
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
