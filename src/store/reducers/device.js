// @flow

import utils from '../../utils';
import type { DeviceAction } from '../types';

export type OrientationValue = 'portrait' | 'landscape';

type Action = DeviceAction;
type State = {
  isAppleDevice: boolean,
  isStandalone: boolean,
  isOnline: boolean,
  orientation: OrientationValue,
};

export function setNetworkStatus(online: boolean): Action {
  return { type: 'SET_NETWORK_STATUS', payload: online };
}

export function setOrientation(direction: OrientationValue): Action {
  return { type: 'SET_ORIENTATION', payload: direction };
}

const initialState: State = {
  isOnline: navigator.onLine,
  isStandalone: utils.isStandalone(),
  orientation: 'portrait',
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_NETWORK_STATUS': {
      return { ...state, isOnline: action.payload };
    }
    case 'SET_ORIENTATION': {
      return { ...state, orientation: action.payload };
    }
    default: {
      return state;
    }
  }
}
