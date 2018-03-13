// @flow

import React, { Component, Fragment } from 'react';
import Input from '../components/input';
import utils from '../utils';

import type { RouterHistory } from 'react-router-dom';

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
    url: 'http://google.com',
  },
  {
    label: 'Another One',
    url: 'http://duckduckgo.com',
  },
];

type Props = {
  history: RouterHistory,
};

type State = {
  seriesUrl: string,
  examples: Array<{ label: string, url: string }>,
};

export default class HomeView extends Component<Props, State> {
  state = {
    seriesUrl: '',
    isFetching: false,
    examples: utils.getRandomItems(examplesList, 3),
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const { history } = this.props;
    e.preventDefault();
    // TODO: fetch chapter or series to server
    history.push('/c/a4vhAoFG');
  };

  handleSeriesUrlChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ seriesUrl: e.target.value });
  };

  handleExampleClick = (url: string) => () => {
    this.setState({ seriesUrl: url });
  };

  render() {
    const { examples, seriesUrl } = this.state;

    return (
      <div className="mw-500">
        <p>Hi!</p>
        <p className="mt-2">
          <strong>Poketo</strong> is a friendly manga tracker for following
          series you like.
        </p>
        <p className="mt-2">
          <form onSubmit={this.handleSubmit}>
            <Input
              type="url"
              placeholder="Paste link to series…"
              onChange={this.handleSeriesUrlChange}
              value={seriesUrl}
            />
            <button className="Button" type="submit">
              Read
            </button>
          </form>
        </p>
        <p className="mt-1 fs-12">
          For example,{' '}
          {examples.map((example, i) => (
            <Fragment>
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
