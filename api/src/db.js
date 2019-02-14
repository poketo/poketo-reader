// @flow

import 'now-env';
import pg from 'pg';
import knex from 'knex';
import knexfile from '../knexfile';
import type { Series } from 'poketo';
import type { Bookmark } from '../../shared/types';
import utils from './utils';

export const db = knex(knexfile);

async function findCollectionBySlug(collectionSlug: string) {
  const result = await db('collections')
    .where({ slug: collectionSlug })
    .first();

  if (!result) {
    throw new Error(`Collection '${collectionSlug}' not found`);
  }

  return result;
}

async function findBookmarksByCollectionSlug(collectionSlug: string) {
  return db
    .select('*')
    .from('bookmarks')
    .where({ collection: collectionSlug });
}

async function insertUser() {
  //
}

async function insertCollection(slug: string, ownerId: string) {
  //
}

async function insertBookmark(
  collectionId: string,
  seriesId: string,
  seriesUrl: string,
  lastReadChapterId: string | null,
  linkToUrl: string | null,
) {
  //
}

async function deleteBookmark(collectionId: string, seriesId: string) {
  //
}

export default {
  findCollectionBySlug,
  insertUser,
  insertCollection,
  insertBookmark,
  deleteBookmark,
};

// export class Collection extends Model {
//   collection() {
//     return 'collections';
//   }
// }
//
// const extendCollection = Collection => {
//   Collection.prototype.addBookmark = function(
//     series: Series,
//     linkToUrl: ?string = null,
//     lastReadChapterId: string | null = null,
//   ) {
//     const bookmarks = this.get('bookmarks');
//     const existingBookmark = bookmarks.find(
//       bookmark => bookmark.id === series.id,
//     );
//
//     if (existingBookmark) {
//       const err: any = new Error(
//         `A bookmark for ${series.url} already exists!`,
//       );
//       err.status = 400;
//       throw err;
//     }
//
//     const bookmark: Bookmark = {
//       id: series.id,
//       url: series.url,
//       lastReadChapterId,
//       lastReadAt: utils.timestamp(),
//     };
//
//     if (linkToUrl) {
//       bookmark.linkTo = linkToUrl;
//     }
//
//     const newBookmarks = [...bookmarks, bookmark];
//
//     this.set('bookmarks', newBookmarks);
//   };
//
//   Collection.prototype.removeBookmark = function(seriesId) {
//     const bookmarks = this.get('bookmarks');
//     const bookmarkIndex = bookmarks.findIndex(
//       bookmark => bookmark.id === seriesId,
//     );
//
//     if (bookmarkIndex === -1) {
//       const err: any = new Error(`Could not find bookmark with ID ${seriesId}`);
//       err.status = 404;
//       throw err;
//     }
//
//     const newBookmarks = utils.deleteItemAtIndex(bookmarks, bookmarkIndex);
//
//     if (newBookmarks.length === 0) {
//       const err: any = new Error(
//         `Cannot delete last bookmark in a collection. Delete the collection instead.`,
//       );
//       err.status = 400;
//       throw err;
//     }
//
//     // NOTE: Due to a bug in mongorito (https://github.com/vadimdemedes/mongorito/issues/179)
//     // we need to unset bookmarks first before setting it again to "clear" the
//     // array field.
//     this.unset('bookmarks');
//     this.set('bookmarks', newBookmarks);
//   };
// };
