// @flow

import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import bouncer, { Validator } from 'koa-bouncer';
import logger from 'koa-bunyan-logger';
import cors from '@koa/cors';
import pkg from '../package';
import utils from './utils';

const app = new Koa();

Validator.addMethod('isUrl', function(tip = 'Invalid URL') {
  this.isString(tip)
    .trim()
    .checkPred(str => utils.isUrl(str));
  return this;
});

Validator.addMethod('isPoketoId', function(tip = 'Invalid Poketo ID') {
  this.isString(tip)
    .trim()
    .checkPred(str => utils.isPoketoId(str));
  return this;
});

app.use(cors());
app.use(bodyparser());
app.use(bouncer.middleware());
app.use(logger({ name: pkg.name }));

export default app;
