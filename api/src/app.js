// @flow

import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import bouncer from 'koa-bouncer';
import logger from 'koa-bunyan-logger';
import cors from '@koa/cors';
import pkg from '../package';

const app = new Koa();

app.use(cors());
app.use(bodyparser());
app.use(bouncer.middleware());
app.use(logger({ name: pkg.name }));

export default app;
