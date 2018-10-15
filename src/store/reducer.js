// @flow

import { combineReducers } from 'redux';

import navigation from './reducers/navigation';
import chapters from './reducers/chapters';
import collections from './reducers/collections';
import series from './reducers/series';

export default combineReducers({
  collections,
  chapters,
  navigation,
  series,
});
