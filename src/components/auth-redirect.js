// @flow

import { Component } from 'react';
import { type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCollectionSlug } from '../store/reducers/navigation';
import utils from '../utils';

type Props = {
  history: RouterHistory,
  redirect: boolean,
  defaultCollection: string,
};

class AuthRedirect extends Component<Props> {
  static mapStateToProps = state => ({
    defaultCollection: getCollectionSlug(state),
  });

  componentDidMount() {
    const { redirect, history, defaultCollection } = this.props;

    if (defaultCollection && redirect) {
      history.replace(utils.getCollectionUrl(defaultCollection));
    }
  }

  render() {
    return null;
  }
}

export default connect(AuthRedirect.mapStateToProps)(AuthRedirect);
