// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import { connect } from 'react-redux';
import { type RouterHistory } from 'react-router-dom';

import type { Dispatch } from '../store/types';
import HomeLayout from '../components/home-layout';
import { clearDefaultCollection } from '../store/reducers/navigation';

type Props = {
  history: RouterHistory,
  logout: () => void,
};

class LogOutView extends Component<Props> {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <HomeLayout>
        <Head>
          <title>Logging out</title>
        </Head>
        <div className="pa-3 x xd-column xa-center xj-center mh-100vh">
          <p>Logging out...</p>
        </div>
      </HomeLayout>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps) {
  return {
    logout() {
      dispatch(clearDefaultCollection());
      ownProps.history.replace('/');
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogOutView);
