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
    .isArray('Bookmarks must be an array');

  const {
    bookmarks: bodyBookmarks,
    slug,
  }: {
    bookmarks: mixed[],
    slug?: string,
  } = ctx.vals;

  const series = await pmap(
    bodyBookmarks,
    bookmark => poketo.getSeries(bookmark.url),
    { concurrency: 3 },
  );

  const user = await db.insertUser({ email: 'hello@example.com', slug });
  const newBookmarks = [];

  series.forEach((series, i) => {
    const bookmark = bodyBookmarks[i];

    newBookmarks.push({
      seriesId: series.id,
      seriesUrl: series.url,
      seriesTitle: series.title,
      seriesDescription: series.description || null,
      seriesCoverImageUrl: series.coverImageUrl || null,
      lastReadChapterId: bookmark.lastReadChapterId,
      linkToUrl: bookmark.linkTo,
    });
  });

  await db.insertBookmarks(user.id, newBookmarks);
  const bookmarks = await db.findBookmarksBySlug(user.slug);

  ctx.body = {
    id: user.id,
    slug: user.slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
  };
}

export async function get(ctx: Context, slug: string) {
  const user = await db.findUserBySlug(slug);
  const bookmarks = await db.findBookmarksBySlug(slug);

  ctx.body = {
    id: user.id,
    slug: user.slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
  };
}

export async function addBookmark(ctx: Context, slug: string) {
  ctx
    .validateBody('seriesUrl')
    .required()
    .isUrl(`seriesUrl must be a valid URL`);
  ctx.validateBody('linkToUrl').optional();
  ctx.validateBody('lastReadChapterId').optional();

  const { seriesUrl, linkToUrl, lastReadChapterId } = ctx.vals;

  const user = await db.findUserBySlug(slug);
  ctx.assert(user.slug, 404, `Collection '${slug}' not found`);
  invariant(user.slug, 'Cannot happen');

  ctx.assert(
    !linkToUrl || utils.isPoketoId(lastReadChapterId),
    400,
    new ValidationError(`linkToUrl must be a valid Poketo ID`),
  );

  ctx.assert(
    !linkToUrl || utils.isUrl(linkToUrl),
    400,
    new ValidationError(`linkToUrl must be a valid URL`),
  );

  // NOTE: we make a request to the series here to both: (a) validate that
  // we can read and support this series and (b) to normalize the URL and
  // ID through poketo so we're not storing duplicates.
  const series = await poketo.getSeries(seriesUrl);

  await db.insertBookmark(user.id, {
    seriesId: series.id,
    seriesUrl: series.url,
    lastReadChapterId,
    linkToUrl,
  });

  const bookmarks = await db.findBookmarksBySlug(user.slug);

  ctx.body = {
    collection: {
      slug: user.slug,
      bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
    },
    series,
  };
}

export async function removeBookmark(
  ctx: Context,
  slug: string,
  seriesId: string,
) {
  const user = await db.findUserBySlug(slug);
  ctx.assert(user.slug, 404, `Collection '${slug}' not found`);

  await db.deleteBookmark(user.id, seriesId);
  const bookmarks = await db.findBookmarksBySlug(slug);

  ctx.body = {
    slug,
    bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
  };
}

export async function markAsRead(ctx: Context, slug: string, seriesId: string) {
  ctx
    .validateBody('lastReadAt')
    .optional()
    .isInt()
    .tap(val => utils.timestampToDate(val));
  ctx
    .validateBody('lastReadChapterId')
    .optional()
    .checkPred(val => typeof val !== 'undefined')
    .checkPred(val => {
      if (val === null) {
        return true;
      }
      return val && val.includes(seriesId) && utils.isPoketoId(seriesId);
    }, `lastReadChapterId must belong to the series at '${seriesId}'`);

  const { lastReadAt, lastReadChapterId } = ctx.vals;

  ctx.assert(
    lastReadAt || lastReadChapterId || lastReadChapterId === null,
    400,
    new ValidationError(
      'lastReadChapterId',
      `Provide a lastReadAt timestamp or a lastReadChapterId id`,
    ),
  );

  const newBookmarkInfo = {};

  if (lastReadAt) {
    newBookmarkInfo.lastReadAt = lastReadAt;
  }

  if (lastReadChapterId === null || lastReadChapterId) {
    newBookmarkInfo.lastReadChapterId = lastReadChapterId;
  }

  const user = await db.findUserBySlug(slug);
  const newBookmark = await db.updateBookmark(
    user.id,
    seriesId,
    newBookmarkInfo,
  );

  ctx.body = newBookmark;
}
