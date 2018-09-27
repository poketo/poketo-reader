// @flow

import type { Node } from 'react';
import { connect } from 'react-redux';
import type { HomeTabId } from '../types';

type Props = {
  backTabId: HomeTabId,
  backTo: string,
  children: ({ to: string, tabId: HomeTabId }) => Node,
};

const BackButtonContainer = ({ children, backTabId, backTo }: Props) =>
  children({ to: backTo, tabId: backTabId });

const mapStateToProps = state => {
  const { collectionSlug, lastSeenTab } = state.auth;

  const backEnding = lastSeenTab === 'now-reading' ? '' : 'library';
  const backTo = collectionSlug ? `/c/${collectionSlug}/${backEnding}` : '/';

  return { backTabId: lastSeenTab, backTo };
};

export default connect(mapStateToProps)(BackButtonContainer);
