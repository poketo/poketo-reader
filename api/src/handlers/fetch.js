// @flow

import poketo from 'poketo';
import type { Context } from 'koa';

function getUrl (ctx: Context) {
  const { query } = ctx.request;
  const { url, id } = query;

  ctx.assert(
    Boolean(url) || Boolean(id),
    400,
    `Please provide either 'id' or 'url' as a query parameter.`,
  );

  return url ? url : poketo.constructUrl(id);
};

export default async function (ctx: Context) {
  const target = getUrl(ctx);
  const type = poketo.getType(target);

  ctx.assert(
    ctx.path === '/' + type,
    400,
    `The resource at '${target}' is a ${type}. Use '/${type}' instead.`,
  );

  ctx.body =
    type === 'chapter'
      ? await poketo.getChapter(target)
      : await poketo.getSeries(target);
}
