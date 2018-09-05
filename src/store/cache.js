// @flow

import { getConfiguredCache } from 'money-clip';

// NOTE: this cache version should be bumped any time the schema of the store
// changes shape, or the API responses change. It'll invalidate cached data and
// force a re-fetch.
const apiVersion = 'pqrtebuhhk';
const storeVersion = '1536114047316';
const version = `${apiVersion}-${storeVersion}`;
const maxAge = 432000000; // 5 days in milliseconds

const cache = getConfiguredCache({ version, maxAge });

export default cache;
