// @flow

import type { Context } from 'koa';
import poketoPkg from 'poketo/package';
import pkg from '../../package';

export default async function (ctx: Context) {
  ctx.body = {
    serverVersion: pkg.version,
    poketoVersion: poketoPkg.version,
  };
}
