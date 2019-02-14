import pmap from 'p-map';
import poketo from 'poketo';
import shortid from 'shortid';
import utils from '../utils';
import db from '../db';

export async function post(ctx) {
  ctx
    .validateBody('slug')
    .optional()
    .isString()
    .trim();
  ctx
    .validateBody('bookmarks')
    .required()
    .toArray()
    .isArray('Bookmarks must be an array');

  const { bookmarks, slug = shortid.generate() } = ctx.vals;

  const series = await pmap(
    bookmarks,
    bookmark => poketo.getSeries(bookmark.url),
    { concurrency: 3 },
  );

  const newCollection = await db.insertCollection(slug);
  const tasks = [];

  for (let i = 0; i < series.length; i++) {
    const bookmark = bookmarks[i];

    tasks.push(() =>
      db.insertBookmark(
        newCollection.id,
        series.id,
        series.url,
        bookmark.lastReadChapterId,
        bookmark.linkTo,
      ),
    );
  }

  await Promise.all(tasks);

  series.forEach((s, i) => {
    const bookmark = bookmarks[i];
    newCollection.addBookmark(s, bookmark.linkTo, bookmark.lastReadChapterId);
  });

  await newCollection.save();

  ctx.body = newCollection;
}

export async function get(ctx, slug) {
  const collection = await db.findCollectionBySlug(slug);
  const bookmarks = collection.bookmarks || [];

  ctx.body = {
    id: collection.id,
    slug: collection.slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
  };
}

export async function addBookmark(ctx, slug) {
  ctx
    .validateBody('seriesUrl')
    .required()
    .isString()
    .trim();
  ctx
    .validateBody('linkToUrl')
    .optional()
    .isString()
    .trim()
    .checkPred(url => utils.isUrl(url), 'Invalid linkToUrl');
  ctx
    .validateBody('lastReadChapterId')
    .optional()
    .isString();

  const { seriesUrl, linkToUrl, lastReadChapterId } = ctx.vals;

  // NOTE: we make a request to the series here to both: (a) validate that
  // we can read and support this series and (b) to normalize the URL and
  // ID through poketo so we're not storing duplicates.
  const collection = await db.findCollectionBySlug(slug);
  const series = await poketo.getSeries(seriesUrl);

  await db.insertBookmark(
    collection.id,
    series.id,
    series.url,
    lastReadChapterId,
    linkToUrl,
  );

  ctx.body = {
    collection: {
      slug: collection.get('slug'),
      bookmarks: utils.keyArrayBy(collection.get('bookmarks'), obj => obj.id),
    },
    series,
  };
}

export async function removeBookmark(ctx, slug, seriesId) {
  const collection = await db.findCollectionBySlug(slug);
  await db.deleteBookmark(collection.id, seriesId);

  ctx.body = {
    slug: collection.get('slug'),
    bookmarks: utils.keyArrayBy(collection.get('bookmarks'), obj => obj.id),
  };
}

export async function markAsRead(ctx, slug, seriesId) {
  const collection = await db.findCollectionBySlug(slug);
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
