// @flow

import route from 'koa-route';
import app from './app';
import utils from './utils';

import error from './handlers/error';
import meta from './handlers/meta';
import * as collections from './handlers/collections';
import fetch from './handlers/fetch';
import fetchFeed from './handlers/fetch-feed';

app.use(error);
app.on('error', () => {});

app.use(
  route.get('/', async ctx => {
    ctx.statusCode = 404;
    ctx.body = {
      message: `Welcome to the Poketo API! If you're looking for documentation, check out https://github.com/poketo/poketo-reader/tree/master/api`
    }
  }),
);

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

app.use(route.get('/_meta', meta));

app.use(route.post('/collection/new', collections.post));
app.use(route.get('/collection/:slug', collections.get));
const bookmarkRoot = '/collection/:slug/bookmark';
app.use(route.post(bookmarkRoot + '/new', collections.addBookmark));
app.use(route.delete(bookmarkRoot + '/:seriesId', collections.removeBookmark));
app.use(route.post(bookmarkRoot + '/:seriesId/read', collections.markAsRead));

app.use(route.get('/series', fetch));
app.use(route.get('/chapter', fetch));
app.use(route.get('/feed/:id.json', fetchFeed));

/**
 * Server
 */

const PORT = process.env.PORT || '3001';

app.listen(PORT, err => {
  if (err) {
    console.error('> Error occurred during server startup:');
    console.error(err);
    return;
  }
  console.log(`> Listening on http://localhost:${PORT}`);
});
