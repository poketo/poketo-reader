// @flow

import { type Context } from 'koa';
import { ValidationError } from 'koa-bouncer';
import { NotFoundError } from '../db';

function getErrorStatus(code) {
  switch (code) {
    case 'INVALID_REQUEST':
    case 'INVALID_ID':
    case 'INVALID_URL':
    case 'UNSUPPORTED_SITE':
    case 'UNSUPPORTED_SITE_REQUEST':
      return 400;
    case 'TIMEOUT':
      return 504;
    default:
      return 500;
  }
}

export default async function(ctx: Context, next: () => Promise<void>) {
  try {
    await next();
    const status = ctx.status || 404;
    ctx.assert(status !== 404, 404);
  } catch (err) {
    const body: { message: string, code?: string } = {
      message: err.message,
    };

    if (err.code) {
      body.code = err.code;
    } else if (err instanceof ValidationError) {
      body.code = 'INVALID_REQUEST';
    }

    ctx.status = err.statusCode || err.status || getErrorStatus(body.code);
    ctx.body = body;

    ctx.log.error(err, 'Error during request');
    ctx.app.emit('error', err, ctx);
  }
}
