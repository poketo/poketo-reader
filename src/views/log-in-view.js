// @flow

import React, { Component } from 'react';
import {
  type RouterHistory,
  type Location,
  type Match,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Head from 'react-helmet';

import Alert from '../components/alert';
import Button from '../components/button';
import HomeHeader from '../components/home-header';
import Input from '../components/input';
import {
  getCollectionSlug,
  setDefaultCollection,
} from '../store/reducers/navigation';

type Props = {
  history: RouterHistory,
  login: (slug: string) => void,
  collectionSlug?: string,
  location: Location,
  match: Match,
};
type State = {
  code: string,
};

const DEFAULT_REDIRECT = '/feed';

function getRedirectParam(location: Location): string {
  const query = new URLSearchParams(location.search);
  return query.get('redirect') || DEFAULT_REDIRECT;
}

class LogInView extends Component<Props, State> {
  state = {
    code: '',
  };

  componentDidMount() {
    const { match, login, collectionSlug: localStorageSlug } = this.props;
    const { collectionSlug: urlSlug } = match.params;

    // `urlSlug` is first to give the URL priority (to make it easier to change
    // between multiple collections.)
    if (urlSlug) {
      login(urlSlug);
      return;
    }

    if (localStorageSlug) {
      login(localStorageSlug);
      return;
    }
  }

  handleCodeChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ code: e.currentTarget.value });
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const { login } = this.props;
    const { code: slug } = this.state;

    e.preventDefault();

    login(slug);
  };

  render() {
    const { location } = this.props;
    const { code } = this.state;

    const redirectParam = getRedirectParam(location);
    const hasUniqueRedirect =
      redirectParam !== '/feed' && redirectParam !== '/library';

    const isSubmittable = code.length > 6;

    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">
        <Head>
          <title>Log In</title>
        </Head>
        <HomeHeader />
        <div className="pt-4 ph-3 mw-500 mh-auto ta-center">
          {hasUniqueRedirect && (
            <Alert className="mb-4">
              You need to log in to access that page.
            </Alert>
          )}
          <div className="mb-4">
            <h2 className="fw-semibold mb-2">Log in to Poketo</h2>
            <p>Enter your Poketo code below.</p>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-2">
              <Input
                type="text"
                title="Your nine character Poketo code"
                placeholder="Poketo code…"
                pattern="[A-Za-z0-9_-]{7,10}"
                required
                onChange={this.handleCodeChange}
              />
            </div>
            <Button type="submit" variant="primary" disabled={!isSubmittable}>
              Go
            </Button>
          </form>
          <p className="fs-14 mt-3">
            Your code is the last part of your secret link:{' '}
            <code className="bgc-gray0 br-4 fs-12 pa-1">
              poketo.app/c/
              <span className="fw-medium">
                {'<'}
                your code
                {'>'}
              </span>
            </code>
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const collectionSlug = getCollectionSlug(state);
  return { collectionSlug };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    login(slug) {
      const { location } = ownProps;
      const redirect = getRedirectParam(location);

      dispatch(setDefaultCollection(slug));
      ownProps.history.push(redirect);
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogInView);
