// @flow

import { getConfiguredCache } from 'money-clip';

const MS_IN_HOURS = 60 * 1000;

const cache = getConfiguredCache({
  version: process.env.REACT_APP_COMMIT_REF || 'development',
  maxAge: 1 * MS_IN_HOURS,
});

export default cache;
