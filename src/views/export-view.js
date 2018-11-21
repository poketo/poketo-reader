// @flow

import React, { Component } from 'react';
import download from 'datauri-download';

import CollectionHeader from '../components/collection-header';
import Button from '../components/button';
import Markdown from '../components/markdown';
import api from '../api';
import utils from '../utils';

type Props = {
  match: {
    params: {
      collectionSlug: string,
    },
  },
};

type State = {
  isLoading: boolean,
};

export default class ExportView extends Component<Props, State> {
  state = {
    isLoading: false,
  };

  downloadArchive = () => {
    const { match } = this.props;
    const { collectionSlug } = match.params;

    this.setState({ isLoading: true });

    api
      .fetchCollection(collectionSlug)
      .then(response => {
        const filename = `poketo-archive-${utils.getTimestamp()}`;
        const mimeType = 'application/json';
        const collectionJson = JSON.stringify(response.data, null, 2);

        download(filename, mimeType, collectionJson);

        this.setState({ isLoading: false });
      })
      .catch(err => {
        alert('Sorry, an error occurred');
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { match } = this.props;
    const { collectionSlug } = match.params;
    const { isLoading } = this.state;

    return (
      <div className="pb-6 h-100p">
        <CollectionHeader collectionSlug={collectionSlug} />
        <div className="mw-500 mh-auto pt-4 pt-5-m ph-3 ph-0-m">
          <Markdown>
            <h1>Export Data</h1>
            <p>
              Poketo cares that you stay in control of your data. You can export
              a full archive of your Poketo data from this page.
            </p>
            <div className="bgc-gray0 pa-4 mt-3 mb-4 br-3 ta-center">
              <Button
                variant="primary"
                loading={isLoading}
                onClick={this.downloadArchive}>
                Download archive
              </Button>
            </div>
            <h3>About the archive</h3>
            <p>
              This exporter provides your data in a <code>.json</code> format,
              readable by every common programming language. This archive
              includes your unique collection ID, and the following information
              about each series you follow:
            </p>
            <ul>
              <li>
                <code>id</code>, the series ID, in the Poketo ID format
              </li>
              <li>
                <code>url</code>, the URL you originally entered into Poketo to
                follow it
              </li>
              <li>
                <code>lastReadAt</code>, a timestamp of the last time you read
                the series
              </li>
              <li>
                <code>lastReadChapterId</code>, an ID for the last chapter
                you've read in the series
              </li>
            </ul>
            <p>
              You can use this archive in combination with other tools, like the{' '}
              <a href="https://github.com/poketo/poketo-cli">Poketo CLI</a>, to
              archive series as readable files on your computer.
            </p>
          </Markdown>
        </div>
      </div>
    );
  }
}
