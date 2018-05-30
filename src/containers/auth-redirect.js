// @flow

import { Component } from 'react';
import { type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import utils from '../utils';

type Props = {
  history: RouterHistory,
  redirect: boolean,
  defaultCollection: string,
};

class AuthRedirect extends Component<Props> {
  static mapStateToProps = state => ({
    defaultCollection: state.auth.collectionSlug,
  });

  componentDidMount() {
    const { redirect, history, defaultCollection } = this.props;

    if (defaultCollection && redirect) {
      history.push(utils.getCollectionUrl(defaultCollection));
    }
  }

  render() {
    return null;
  }
}

export default connect(AuthRedirect.mapStateToProps)(AuthRedirect);
