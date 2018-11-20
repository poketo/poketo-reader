import Koa from 'koa';
import route from 'koa-route';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-bunyan-logger';
import cors from '@koa/cors';

import pmap from 'p-map';
import shortid from 'shortid';
import poketo from 'poketo';

import pkg from '../package';
import { Collection } from './db';
import utils from './utils';

const app = new Koa();

app.use(cors());
app.use(bodyparser());
app.use(logger({ name: pkg.name }));

const getErrorStatus = err => {
  switch (err.code) {
    case 'INVALID_URL':
    case 'UNSUPPORTED_SITE':
    case 'UNSUPPORTED_SITE_REQUEST':
      return 400;
    case 'TIMEOUT':
      return 504;
    default: {
      const status =
        // From poketo:
        err.statusCode ||
        // From ctx.assert:
        err.status;

      return status || 500;
    }
  }
};

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const body = {
      message: err.message,
    };

    if (err.code) {
      // Only return an error code for a poketo error
      body.code = err.code;
    }

    ctx.status = err.status || getErrorStatus(err);
    ctx.body = body;

    ctx.log.error(
      err,
      'Error during request from %s for %s',
      ctx.request.get('referer'),
      ctx.path,
    );
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', () => {});

/**
 * Routes
 *
 * GET     /
 * POST    /collection/new
 * GET     /collection/:slug
 * POST    /collection/:slug/bookmark/new
 * DELETE  /collection/:slug/bookmark/:seriesId
 * POST    /collection/:slug/bookmark/:seriesId/read
 *
 * GET     /series/:url
 * GET     /series/:siteId/:seriesSlug
 * GET     /chapter/:url
 * GET     /chapter/:siteId/:seriesSlug/:chapterSlug
 */

app.use(
  route.get('/', async ctx => {
    ctx.assert(
      false,
      404,
      `Welcome to the Poketo API! If you're looking for documentation, check out https://github.com/poketo/poketo-reader/tree/master/api`,
    );
  }),
);

app.use(
  route.post('/collection/new', async ctx => {
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
  }),
);

app.use(
  route.get('/collection/:slug', async (ctx, slug) => {
    const collection = await Collection.findOne({ slug });
    ctx.assert(collection, 404);
    const bookmarks = collection.get('bookmarks');

    ctx.body = {
      slug,
      bookmarks: utils.keyArrayBy(bookmarks, obj => obj.id),
    };
  }),
);

app.use(
  route.post('/collection/:slug/bookmark/new', async (ctx, slug) => {
    const collection = await Collection.findOne({ slug });
    ctx.assert(collection, 404);

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
  }),
);

app.use(
  route.delete(
    '/collection/:slug/bookmark/:seriesId',
    async (ctx, slug, seriesId) => {
      const collection = await Collection.findOne({ slug });
      ctx.assert(collection, 404);

      collection.removeBookmark(seriesId);
      await collection.save();

      ctx.body = {
        slug: collection.get('slug'),
        bookmarks: utils.keyArrayBy(collection.get('bookmarks'), obj => obj.id),
      };
    },
  ),
);

app.use(
  route.post(
    '/collection/:slug/bookmark/:seriesId/read',
    async (ctx, slug, seriesId) => {
      const collection = await Collection.findOne({ slug });
      ctx.assert(collection, 404);

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
    },
  ),
);

const getUrl = ctx => {
  const { query } = ctx.request;
  const { url, id } = query;

  ctx.assert(
    Boolean(url) || Boolean(id),
    400,
    `Please provider either 'id' or 'url' as a query parameter.`,
  );

  return url ? url : poketo.constructUrl(id);
};

const fetch = async ctx => {
  const target = getUrl(ctx);
  const type = poketo.getType(target);

  ctx.assert(
    ctx.path === '/' + type,
    400,
    `The resource at '${target}' is a ${type}. Use '/${type}' instead.`,
  );

  const action = type === 'chapter' ? poketo.getChapter : poketo.getSeries;

  const start = Date.now();
  ctx.body = await action(target);
  const duration = Date.now() - start;

  ctx.log.info(
    {
      target,
      referrer: ctx.request.get('referer'),
      duration,
      type,
    },
    'Fetching',
  );
};

app.use(route.get('/series', fetch));
app.use(route.get('/chapter', fetch));

/**
 * Server
 */

if (process.env.BACKPACK === 'true') {
  const PORT = process.env.PORT || '3001';

  app.listen(PORT, err => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`> Listening on http://localhost:${PORT}`);
  });
}

export default app.callback();
