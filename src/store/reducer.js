// @flow

import { combineReducers } from 'redux';

import chapters from './reducers/chapters';
import collections from './reducers/collections';
import device from './reducers/device';
import series from './reducers/series';

export default combineReducers({
  collections,
  chapters,
  device,
  series,
});
