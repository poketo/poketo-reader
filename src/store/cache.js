// @flow

import { getConfiguredCache } from 'money-clip';
import ms from 'milliseconds';

// NOTE: this cache version should be bumped any time the schema of the store
// changes shape, or the API responses change. It'll invalidate cached data and
// force a re-fetch.
const apiVersion = 'rxmvmpsuta';
const storeVersion = '1530681927316';
const version = `${apiVersion}-${storeVersion}`;

const cache = getConfiguredCache({
  version,
  maxAge: ms.days(5),
});

export default cache;
