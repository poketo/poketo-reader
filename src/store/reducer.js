// @flow

import { combineReducers } from 'redux';

import chapters from './reducers/chapters';
import collections from './reducers/collections';
import meta from './reducers/meta';
import series from './reducers/series';

export default combineReducers({
  collections,
  chapters,
  meta,
  series,
});
