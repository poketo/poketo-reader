// @flow

import { getConfiguredCache } from 'money-clip';
import ms from 'milliseconds';

// NOTE: this cache version should be bumped any time the schema of the store
// changes shape. It'll invalidate the cached data and force a re-fetch.
const version = '1527870408489';

const cache = getConfiguredCache({
  version,
  maxAge: ms.days(5),
});

export default cache;
