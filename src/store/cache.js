// @flow

import { getConfiguredCache } from 'money-clip';
import ms from 'milliseconds';

const cache = getConfiguredCache({
  version: process.env.REACT_APP_COMMIT_REF || 'development',
  maxAge: ms.days(5),
});

export default cache;
