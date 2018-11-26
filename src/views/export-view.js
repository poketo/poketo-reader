// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import download from 'datauri-download';

import CollectionHeader from '../components/collection-header';
import Button from '../components/button';
import Markdown from '../components/markdown';
import api from '../api';
import { getCollectionSlug } from '../store/reducers/navigation';
import utils from '../utils';

type ExportBlockProps = {
  collectionSlug: string,
};

type ExportBlockState = {
  isLoading: boolean,
};

function downloadCollection(collectionSlug) {
  return api.fetchCollection(collectionSlug).then(response => {
    const filename = `poketo-archive-${utils.getTimestamp()}`;
    const mimeType = 'application/json';
    const collectionJson = JSON.stringify(response.data, null, 2);

    download(filename, mimeType, collectionJson);
  });
}

class ExportBlock extends Component<ExportBlockProps, ExportBlockState> {
  state = {
    isLoading: false,
  };

  downloadArchive = () => {
    const { collectionSlug } = this.props;

    this.setState({ isLoading: true });

    downloadCollection(collectionSlug)
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(err => {
        alert('Sorry, an error occurred');
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className="bgc-gray0 pa-4 mt-3 mb-4 br-3 ta-center">
        <Button
          variant="primary"
          loading={isLoading}
          onClick={this.downloadArchive}>
          Download archive
        </Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const collectionSlug = getCollectionSlug(state);
  return { collectionSlug };
}

const ConnectedExportBlock = connect(mapStateToProps)(ExportBlock);

type Props = {};

export default class ExportView extends Component<Props> {
  render() {
    return (
      <div className="h-100p">
        <CollectionHeader />
        <div className="mw-500 mh-auto pt-3 ph-3 ph-0-m pb-6">
          <Markdown>
            <h1>Export Data</h1>
            <p>
              Poketo cares that you stay in control of your data. You can export
              a full archive of your Poketo data from this page.
            </p>
            <ConnectedExportBlock />
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
