import pmap from 'p-map';
import poketo from 'poketo';
import shortid from 'shortid';
import utils from '../utils';
import { Collection } from '../db';

export async function post(ctx) {
  const { bookmarks } = ctx.request.body;

  ctx.assert(Array.isArray(bookmarks), 400, `Bookmarks must be an array`);
  ctx.assert(
    bookmarks.length > 0,
    400,
    `Bookmarks must have at least one series URL`,
  );

  const series = await pmap(
    bookmarks,
    bookmark => poketo.getSeries(bookmark.url),
    { concurrency: 3 },
  );

  const newCollection = new Collection({
    slug: shortid.generate(),
    bookmarks: [],
  });

  series.forEach((s, i) => {
    const bookmark = bookmarks[i];
    newCollection.addBookmark(s, bookmark.linkTo, bookmark.lastReadChapterId);
  });

  await newCollection.save();

  ctx.body = newCollection;
};

async function getCollectionBySlug(ctx, slug) {
  const collection = await Collection.findOne({ slug });
  ctx.assert(collection, 404);
  return collection;
}

export async function get(ctx, slug) {
  const collection = await getCollectionBySlug(ctx, slug);
  const bookmarks = collection.get('bookmarks');

  ctx.body = {
    slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
  };
}

export async function addBookmark(ctx, slug) {
  const collection = await getCollectionBySlug(ctx, slug);
  const { seriesUrl, linkToUrl, lastReadChapterId } = ctx.request.body;

  ctx.assert(utils.isUrl(seriesUrl), 400, `Invalid URL '${seriesUrl}'`);
  ctx.assert(
    !linkToUrl || utils.isUrl(linkToUrl),
    400,
    `Invalid URL '${linkToUrl ? linkToUrl : ''}'`,
  );

  // NOTE: we make a request to the series here to both: (a) validate that
  // we can read and support this series and (b) to normalize the URL and
  // ID through poketo so we're not storing duplicates.
  const series = await poketo.getSeries(seriesUrl);

  collection.addBookmark(series, linkToUrl, lastReadChapterId);
  await collection.save();

  ctx.body = {
    collection: {
      slug: collection.get('slug'),
      bookmarks: utils.keyArrayBy(collection.get('bookmarks'), obj => obj.id),
    },
    series,
  };
}

export async function removeBookmark(ctx, slug, seriesId) {
  const collection = await getCollectionBySlug(ctx, slug);
  collection.removeBookmark(seriesId);
  await collection.save();

  ctx.body = {
    slug: collection.get('slug'),
    bookmarks: utils.keyArrayBy(collection.get('bookmarks'), obj => obj.id),
  };
}

export async function markAsRead(ctx, slug, seriesId) {
  const collection = await getCollectionBySlug(ctx, slug);
  const bookmarks = collection.get('bookmarks');
  const currentBookmarkIndex = bookmarks.findIndex(
    bookmark => bookmark.id === seriesId,
  );
  const currentBookmark = bookmarks[currentBookmarkIndex];
  ctx.assert(
    currentBookmarkIndex !== -1,
    404,
    `Could not find bookmark with ID ${seriesId}`,
  );

  const { lastReadAt, lastReadChapterId } = ctx.request.body;

  const hasValidLastReadId =
    lastReadChapterId === null || utils.isPoketoId(lastReadChapterId);
  const hasValidLastReadAt = Number.isInteger(lastReadAt);
  const hasValidReadIndicator = hasValidLastReadId || hasValidLastReadAt;

  ctx.assert(
    hasValidReadIndicator,
    400,
    `Could not parse 'lastReadAt' timestamp or 'lastReadChapterId' id`,
  );

  if (hasValidLastReadId) {
    ctx.assert(
      lastReadChapterId === null ||
        lastReadChapterId.includes(currentBookmark.id),
      400,
      `The ID '${lastReadChapterId}' does not correspond to the series at '${
        currentBookmark.id
      }'`,
    );
  }

  const newBookmark = { ...currentBookmark };

  if (hasValidLastReadAt) {
    newBookmark.lastReadAt = lastReadAt;
  }

  if (hasValidLastReadId) {
    newBookmark.lastReadChapterId = lastReadChapterId;
  }

  const newBookmarks = utils.replaceItemAtIndex(
    bookmarks,
    currentBookmarkIndex,
    newBookmark,
  );
  collection.set('bookmarks', newBookmarks);
  await collection.save();

  ctx.body = newBookmark;
}
