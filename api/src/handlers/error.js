// @flow

import { type Context } from 'koa';
import { ValidationError } from 'koa-bouncer';
import { NotFoundError } from '../db';
import type { ApiErrorCode } from '../../../shared/types';

const errorCodeToStatus: { [ApiErrorCode]: number } = {
  INVALID_REQUEST: 400,
  INVALID_ID: 400,
  INVALID_URL: 400,
  UNSUPPORTED_SITE: 400,
  UNSUPPORTED_SITE_REQUEST: 400,
  LICENSE_ERROR: 451,
  TIMEOUT: 504,
  SERVER_ERROR: 500,
};

function getErrorStatus(code: ApiErrorCode): number {
  const statusNumber = errorCodeToStatus[code];
  return statusNumber || 500;
}

export default async function(ctx: Context, next: () => Promise<void>) {
  try {
    await next();
    const status = ctx.status || 404;
    ctx.assert(status !== 404, 404);
  } catch (err) {
    const body: { message: string, code: ApiErrorCode } = {
      code: 'SERVER_ERROR',
      message: err.message,
    };

    if (err instanceof ValidationError) {
      body.code = 'INVALID_REQUEST';
      body.message = err.message;
    } else if (err.code) {
      body.code = err.code;
    }

    ctx.status = err.statusCode || err.status || getErrorStatus(body.code);
    ctx.body = body;

    ctx.log.error(err, 'Error during request');
    ctx.app.emit('error', err, ctx);
  }
}
