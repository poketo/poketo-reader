// @flow

import { getConfiguredCache } from 'money-clip';

const MILLISECONDS_IN_A_DAY = 86400000;

// NOTE: this cache version should be bumped any time the schema of the store
// changes shape, or the API responses change. It'll invalidate cached data and
// force a re-fetch.
const apiVersion = 'rxmvmpsuta';
const storeVersion = '1530681927316';
const version = `${apiVersion}-${storeVersion}`;
const maxAge = 5 * MILLISECONDS_IN_A_DAY;

const cache = getConfiguredCache({ version, maxAge });

export default cache;
