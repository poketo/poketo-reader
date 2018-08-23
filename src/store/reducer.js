// @flow

import { combineReducers } from 'redux';

import auth from './reducers/auth';
import chapters from './reducers/chapters';
import collections from './reducers/collections';
import series from './reducers/series';

export default combineReducers({
  auth,
  collections,
  chapters,
  series,
});
