// @flow

import type { EntityShorthand, EntityStatus } from './types';

export function getEntityShorthand<T>(
  store: { [id: string]: T, _status: { [id: string]: EntityStatus } },
  id: string,
): EntityShorthand<T> {
  const entity = store[id];
  const status = store._status[id] || {};

  const { fetchStatus, errorCode } = status;

  return {
    entity: fetchStatus === 'fetched' ? entity : null,
    isFetching: fetchStatus === 'fetching' || !fetchStatus,
    errorCode: errorCode || null,
  };
}
