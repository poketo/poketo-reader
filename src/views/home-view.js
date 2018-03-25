// @flow

import React, { Component, Fragment } from 'react';
import Button from '../components/button';
import IconPoketo from '../components/icon-poketo';
import Input from '../components/input';
import utils from '../utils';

import type { RouterHistory } from 'react-router-dom';
import type { TraeError, TraeResponse } from '../types';

const examplesList = [
  {
    label: 'Senryu Girl from Meraki',
    url: 'http://merakiscans.com/senryu-girl/',
  },
  {
    label: 'Urami Koi on Mangakakalot',
    url: 'http://mangakakalot.com/manga/urami_koi_koi_urami_koi',
  },
  {
    label: 'Oyasumi Punpun',
    url: 'http://manganelo.com/manga/oyasumi_punpun',
  },
];

type FetchErrorCode =
  | 'INVALID_URL'
  | 'INVALID_SERIES'
  | 'SERVER_UNSUPPORTED_SITE'
  | 'SERVER_UNKNOWN_ERROR';

type Props = {
  history: RouterHistory,
};

type State = {
  url: string,
  errorCode: ?FetchErrorCode,
  isFetching: boolean,
  examples: Array<{ label: string, url: string }>,
};

export default class HomeView extends Component<Props, State> {
  state = {
    url: '',
    errorCode: null,
    isFetching: false,
    examples: utils.getRandomItems(examplesList, 3),
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const { url } = this.state;
    e.preventDefault();

    if (!utils.isUrl(url)) {
      this.setState({ errorCode: 'INVALID_URL' });
      return;
    }

    this.setState({ errorCode: null, isFetching: true });

    // NOTE: if we switch to having a client-side poketo library, we could just
    // parse the URL and send them directly to the reader view. Instead, we send
    // it to the server first.
    utils
      .fetchSeriesByUrl(url)
      .then(this.handleSubmitSuccess)
      .catch(this.handleSubmitError);
  };

  handleSubmitSuccess = (response: TraeResponse) => {
    const { history } = this.props;
    const { data: series } = response;

    history.push(
      utils.getReaderUrl(
        null,
        series.site.id,
        series.slug,
        series.chapters[0].slug,
      ),
    );
  };

  handleSubmitError = (err: TraeError) => {
    let errorCode;

    switch (err.status) {
      case 400:
        errorCode =
          err.data.indexOf('not supported') === -1
            ? 'INVALID_URL'
            : 'SERVER_UNSUPPORTED_SITE';
        break;
      case 404:
        errorCode = 'INVALID_SERIES';
        break;
      default:
        errorCode = 'SERVER_UNKNOWN_ERROR';
        break;
    }

    this.setState({ errorCode, isFetching: false });
  };

  handleSeriesUrlChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ url: e.target.value });
  };

  handleExampleClick = (url: string) => () => {
    this.setState({ url });
  };

  render() {
    const { errorCode, examples, isFetching, url } = this.state;

    return (
      <div className="mw-900 mh-auto ta-center-m pv-5 ph-3">
        <span className="fs-12 ls-loose tt-uppercase">Beta</span>
        <p className="mt-2 fs-20">
          <IconPoketo /> is a friendly manga tracker for following series you
          like.
        </p>
        <div className="mv-4">
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="x-m">
              <Input
                className="fs-20-m"
                type="url"
                placeholder="Paste link to series…"
                onChange={this.handleSeriesUrlChange}
                value={url}
              />
              <Button
                className="mt-2 mt-0-m"
                inline
                loading={isFetching}
                type="submit">
                Read
              </Button>
            </div>
            {errorCode && <p className="mt-2 c-red">{errorCode}</p>}
          </form>
        </div>
        <p className="mt-3 fs-12">
          For example,{' '}
          {examples.map((example, i) => (
            <Fragment key={example.url}>
              <button
                className="Link"
                onClick={this.handleExampleClick(example.url)}>
                {example.label}
              </button>
              {i !== examples.length - 1 ? ', ' : ''}
            </Fragment>
          ))}.
        </p>
      </div>
    );
  }
}
