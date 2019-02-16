// @flow

import pmap from 'p-map';
import type { Context } from 'koa';
import { ValidationError } from 'koa-bouncer';
import poketo from 'poketo';
import utils, { invariant } from '../utils';
import db from '../db';

export async function post(ctx: Context) {
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

  const { bookmarks, slug } = ctx.vals;

  const series = await pmap(
    bookmarks,
    bookmark => poketo.getSeries(bookmark.url),
    { concurrency: 3 },
  );

  const user = await db.insertUser({ email: 'hello@example.com', slug });
  const newBookmarks = [];

  series.forEach((series, i) => {
    const bookmark = bookmarks[i];

    newBookmarks.push({
      seriesPid: series.id,
      seriesUrl: series.url,
      lastReadChapterPid: bookmark.lastReadChapterId,
      linkToUrl: bookmark.linkTo,
    });
  });

  const result = await db.insertBookmarks(user.id, newBookmarks);
  console.log(result);

  ctx.body = user;
}

export async function get(ctx: Context, slug: string) {
  const user = await db.findUserBySlug(slug);
  const bookmarks = await db.findBookmarksBySlug(slug);

  ctx.body = {
    id: user.id,
    slug: user.slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.seriesPid),
  };
}

export async function addBookmark(ctx: Context, slug: string) {
  ctx
    .validateBody('seriesUrl')
    .required()
    .isUrl(`'seriesUrl' is not a valid URL`);
  ctx
    .validateBody('linkToUrl')
    .optional()
    .isUrl(`'linkToUrl' is not a valid URL`);
  ctx
    .validateBody('lastReadChapterId')
    .optional()
    .isPoketoId(`'lastReadChapterId' is not a valid Poketo ID`);

  const { seriesUrl, linkToUrl, lastReadChapterId } = ctx.vals;

  const user = await db.findUserBySlug(slug);
  ctx.assert(user.slug, 404, `Collection '${slug}' not found`);

  // NOTE: we make a request to the series here to both: (a) validate that
  // we can read and support this series and (b) to normalize the URL and
  // ID through poketo so we're not storing duplicates.
  const series = await poketo.getSeries(seriesUrl);

  await db.insertBookmark(user.id, {
    seriesPid: series.id,
    seriesUrl: series.url,
    lastReadChapterPid: lastReadChapterId,
    linkToUrl,
  });

  // $FlowFixMe: User is guaranteed to exist by ctx.assert above
  const bookmarks = await db.findBookmarksBySlug(user.slug);

  ctx.body = {
    collection: {
      slug: user.slug,
      bookmarks: utils.keyArrayBy(bookmarks, obj => obj.seriesPid),
    },
    series,
  };
}

export async function removeBookmark(
  ctx: Context,
  slug: string,
  seriesPid: string,
) {
  const user = await db.findUserBySlug(slug);
  ctx.assert(user.slug, 404, `Collection '${slug}' not found`);

  await db.deleteBookmark(user.id, seriesPid);
  const bookmarks = await db.findBookmarksBySlug(slug);

  ctx.body = {
    slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.seriesPid),
  };
}

export async function markAsRead(
  ctx: Context,
  slug: string,
  seriesPid: string,
) {
  ctx
    .validateBody('lastReadAt')
    .optional()
    .isInt();
  ctx
    .validateBody('lastReadChapterId')
    .optional()
    .checkPred(val => typeof val !== 'undefined')
    .checkPred(val => {
      if (val === null) {
        return true;
      }
      return val && val.includes(seriesPid) && utils.isPoketoId(seriesPid);
    }, `'lastReadChapterId' does not correspond to the series at '${seriesPid}'`);

  const { lastReadAt, lastReadChapterId } = ctx.vals;

  ctx.assert(
    lastReadAt || lastReadChapterId,
    400,
    new ValidationError(
      'lastReadChapterId',
      `Please provide either a 'lastReadAt' timestamp or a 'lastReadChapterId' id`,
    ),
  );

  const newBookmarkInfo = {};

  if (lastReadAt) {
    newBookmarkInfo.lastReadAt = lastReadAt;
  }

  if (lastReadChapterId === null || lastReadChapterId) {
    newBookmarkInfo.lastReadChapterPid = lastReadChapterId;
  }

  const user = await db.findUserBySlug(slug);
  const newBookmark = await db.updateBookmark(
    user.id,
    seriesPid,
    newBookmarkInfo,
  );

  ctx.body = newBookmark;
}
