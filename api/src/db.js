// @flow

import 'now-env';
import { Database, Model } from 'mongorito';
import type { Series } from 'poketo';
import type { Bookmark } from '../../shared/types';
import utils from './utils';

const db = new Database(process.env.MONGO_URL, {
  reconnectTries: 3,
});

export class Collection extends Model {}

const extendCollection = Collection => {
  Collection.prototype.addBookmark = function(
    series: Series,
    linkToUrl: ?string = null,
    lastReadChapterId: string | null = null,
  ) {
    const bookmarks = this.get('bookmarks');
    const existingBookmark = bookmarks.find(
      bookmark => bookmark.id === series.id,
    );

    if (existingBookmark) {
      const err: any = new Error(
        `A bookmark for ${series.url} already exists!`,
      );
      err.status = 400;
      throw err;
    }

    const bookmark: Bookmark = {
      id: series.id,
      url: series.url,
      lastReadChapterId,
      lastReadAt: utils.timestamp(),
    };

    if (linkToUrl) {
      bookmark.linkTo = linkToUrl;
    }

    const newBookmarks = [...bookmarks, bookmark];

    this.set('bookmarks', newBookmarks);
  };

  Collection.prototype.removeBookmark = function(seriesId) {
    const bookmarks = this.get('bookmarks');
    const bookmarkIndex = bookmarks.findIndex(
      bookmark => bookmark.id === seriesId,
    );

    if (bookmarkIndex === -1) {
      const err: any = new Error(`Could not find bookmark with ID ${seriesId}`);
      err.status = 404;
      throw err;
    }

    const newBookmarks = utils.deleteItemAtIndex(bookmarks, bookmarkIndex);

    if (newBookmarks.length === 0) {
      const err: any = new Error(
        `Cannot delete last bookmark in a collection. Delete the collection instead.`,
      );
      err.status = 400;
      throw err;
    }

    // NOTE: Due to a bug in mongorito (https://github.com/vadimdemedes/mongorito/issues/179)
    // we need to unset bookmarks first before setting it again to "clear" the
    // array field.
    this.unset('bookmarks');
    this.set('bookmarks', newBookmarks);
  };
};

Collection.use(extendCollection);

db.register(Collection);
db.connect();

export default db;
export { ObjectId } from 'mongorito';
