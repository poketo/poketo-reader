// @flow

import React, { Component, Fragment, type Node } from 'react';
import { type RouterHistory } from 'react-router-dom';

import Button from '../components/button';
import Input from '../components/input';
import utils from '../utils';
import api from '../api';

import type { AxiosResponse, AxiosError } from '../api';

const examplesList = [
  {
    label: 'Senryu Girl',
    url: 'http://merakiscans.com/senryu-girl/',
  },
  {
    label: 'Urami Koi, Koi, Urami Koi',
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

const errorMessages: { [code: FetchErrorCode]: Node } = {
  INVALID_URL: 'Please enter a valid URL.',
  INVALID_SERIES: `We couldn't find a series at that URL. Is it working?`,
  SERVER_UNSUPPORTED_SITE: `Sorry, but that site isn't supported`,
  SERVER_UNKNOWN_ERROR: `Sorry, something went wrong.`,
};

export default class ReaderForm extends Component<Props, State> {
  state = {
    url: '',
    errorCode: null,
    isFetching: false,
    examples: utils.getRandomItems(examplesList, 3),
  };

  handleSubmit = (e: ?SyntheticEvent<HTMLFormElement>) => {
    const { url } = this.state;
    if (e) {
      e.preventDefault();
    }

    if (!utils.isUrl(url)) {
      this.setState({ errorCode: 'INVALID_URL' });
      return;
    }

    this.setState({ errorCode: null, isFetching: true });

    // NOTE: if we switch to having a client-side poketo library, we could just
    // parse the URL and send them directly to the reader view. Instead, we send
    // it to the server first.
    api
      .fetchSeriesByUrl(url)
      .then(this.handleSubmitSuccess)
      .catch(this.handleSubmitError);
  };

  handleSubmitSuccess = (response: AxiosResponse) => {
    const { history } = this.props;
    const { data: series } = response;

    history.push(
      utils.getReaderUrl(
        null,
        series.site.id,
        series.slug,
        utils.leastRecentChapter(series.chapters).slug,
      ),
    );
  };

  handleSubmitError = (err: AxiosError) => {
    let errorCode;

    switch (err.response.status) {
      case 400:
        errorCode =
          err.response.data.indexOf('not supported') === -1
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
    this.setState({ url }, () => {
      this.handleSubmit();
    });
  };

  render() {
    const { errorCode, examples, isFetching, url } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="x-m">
            <Input
              className="fs-20-m br-flushRight-m br-0-m"
              type="url"
              placeholder="Paste link to series…"
              onChange={this.handleSeriesUrlChange}
              value={url}
            />
            <Button
              className="mt-2 mt-0-m br-flushLeft-m"
              inline
              loading={isFetching}
              type="submit">
              Read
            </Button>
          </div>
          {errorCode && (
            <p className="mt-2 c-red">{errorMessages[errorCode]}</p>
          )}
        </form>
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
