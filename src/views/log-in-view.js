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
import api from '../api';
import config from '../config';
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
  isFetching: boolean,
  errorCode: null | 'NOT_FOUND' | 'NO_RESPONSE' | 'UNKNOWN',
  errorSlug: null | string,
  slug: string,
};

const DEFAULT_REDIRECT = '/feed';

function getRedirectParam(location: Location): string {
  const query = new URLSearchParams(location.search);
  return query.get('redirect') || DEFAULT_REDIRECT;
}

class LogInView extends Component<Props, State> {
  state = {
    slug: '',
    isFetching: false,
    errorCode: null,
    errorSlug: null,
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
    this.setState({ slug: e.currentTarget.value });
  };

  handleSubmitError = err => {
    if (!err.response) {
      this.setState({ errorCode: 'NO_RESPONSE' });
      return;
    }

    switch (err.response.status) {
      case 404:
        this.setState({ errorCode: 'NOT_FOUND' });
        break;
      default:
        this.setState({ errorCode: 'UNKNOWN' });
    }
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const { login } = this.props;
    const { slug } = this.state;

    e.preventDefault();

    this.setState({ isFetching: true, errorCode: null, errorSlug: null });
    api
      .fetchCollection(slug)
      .then(res => {
        this.setState({ isFetching: false });
        login(slug);
      })
      .catch(err => {
        this.setState({ isFetching: false, errorSlug: slug });
        this.handleSubmitError(err);
      });
  };

  render() {
    const { location } = this.props;
    const { slug, errorCode, errorSlug, isFetching } = this.state;

    const redirectParam = getRedirectParam(location);
    const hasUniqueRedirect =
      redirectParam !== '/feed' && redirectParam !== '/library';

    const isSubmittable = slug.length > 7;

    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">
        <Head title="Log In" />
        <HomeHeader />
        <div className="pt-4 ph-3 mw-500 mh-auto ta-center">
          {hasUniqueRedirect && errorCode === null && (
            <Alert className="mb-4">
              You need to log in to access that page.
            </Alert>
          )}
          <div className="mb-4">
            <h2 className="fw-semibold">Log in to Poketo</h2>
            <p>Enter your Poketo code below.</p>
          </div>
          {errorCode &&
            (errorCode === 'NOT_FOUND' ? (
              <Alert className="mb-4">
                No collection was found for "{errorSlug}"
              </Alert>
            ) : errorCode === 'NO_RESPONSE' ? (
              <Alert className="mb-4">
                No response from the server.
                <br /> Are you connected to the internet?
              </Alert>
            ) : (
              <Alert className="mb-4">An unknown error occurred.</Alert>
            ))}
          <form onSubmit={this.handleSubmit} className="mb-4">
            <div className="mb-3">
              <div className="x">
                <div className="x xa-center ph-2 ba-1 bc-gray1 c-gray4 pe-none br-3 br-flushRight bgc-gray0 ff-mono fs-14">
                  <span className="pl-1">poketo.app/c/</span>
                </div>
                <Input
                  type="text"
                  className="br-flushLeft ff-mono fs-14"
                  title="Your nine character Poketo code"
                  pattern="[A-Za-z0-9_-]{7,10}"
                  autoFocus
                  maxLength="10"
                  autocorrect="off"
                  autocapitalize="none"
                  value={slug}
                  disabled={isFetching}
                  required
                  onChange={this.handleCodeChange}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!isSubmittable}
              loading={isFetching}>
              Log In
            </Button>
          </form>
          <div className="fs-14 ph-2">
            <p>
              Your secret code is the nine characters at the end of your invite
              link.
            </p>
            <p>
              <span>Don't have a secret code?</span>{' '}
              <a
                className="Link"
                href={config.inviteUrl}
                target="_blank"
                rel="noopener noreferrer">
                Request an invite.
              </a>
            </p>
          </div>
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
