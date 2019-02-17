// @flow

import poketo from 'poketo';
import type { Context } from 'koa';
import { ValidationError } from 'koa-bouncer';

function getUrl(ctx: Context) {
  ctx
    .validateQuery('url')
    .optional()
    .isString()
    .trim();
  ctx
    .validateQuery('id')
    .optional()
    .isString()
    .trim();

  const { url, id } = ctx.vals;

  ctx.assert(
    Boolean(url) || Boolean(id),
    400,
    new ValidationError(
      `Please provide either 'id' or 'url' as a query parameter.`,
    ),
  );

  return url ? url : poketo.constructUrl(id);
}

export default async function(ctx: Context) {
  const target = getUrl(ctx);
  const type = poketo.getType(target);

  ctx.assert(
    ctx.path === '/' + type,
    400,
    new ValidationError(
      `The resource at '${target}' is a ${type}. Use '/${type}' instead.`,
    ),
  );

  ctx.body =
    type === 'chapter'
      ? await poketo.getChapter(target)
      : await poketo.getSeries(target);
}
