// @flow

import { type Context } from 'koa';

function getErrorStatus (err) {
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

export default async function (ctx: Context, next: () => Promise<void>) {
  try {
    await next();
    const status = ctx.status || 404;
    ctx.assert(status !== 404, 404);
  } catch (err) {
    const body: { message: string, code?: string } = {
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
}
