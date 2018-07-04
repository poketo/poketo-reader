// @flow

import React, { Component, Fragment, type Node } from 'react';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import debounce from 'throttle-debounce/debounce';
import Button from '../components/button';
import Input from '../components/input';
import Panel from '../components/panel';
import api, { type AxiosError } from '../api';
import config from '../config';
import utils from '../utils';

import schema from '../store/schema';

import type { Series } from '../types';
import type { Dispatch, EntitiesPayload } from '../store/types';

type NewSeriesErrorCode =
  | 'REQUEST_FAILED'
  | 'INVALID_SERIES'
  | 'INVALID_URL'
  | 'UNSUPPORTED_SITE'
  | 'SERIES_NOT_FOUND'
  | 'SERIES_ALREADY_EXISTS'
  | 'UNKNOWN_ERROR';

type BookmarkFetchState = 'ADDED' | 'READY' | 'SUBMITTING' | 'UNREADY';

type Props = {
  addEntities: (entities: EntitiesPayload) => void,
  collectionSlug: string,
  onRequestClose: () => void,
};

type State = {
  bookmarkFetchState: BookmarkFetchState,
  errorCode: ?NewSeriesErrorCode,
  isFetchingPreview: boolean,
  isPreviewing: boolean,
  linkToUrl: ?string,
  seriesUrl: ?string,
  seriesPreview: ?Series,
};

// TODO: Have these values loaded directly from the poketo library or returned
// series requests
const SUPPORTED_SITES = /mangadex|mangahere|mangakakalot|manganelo|mangaupdates|helveticascans|merakiscans|kireicake|readms|hotchocolatescans|jaiminisbox|sensescans|serenade|silentsky-scans|tukimoop/i;
const LINK_TO_SITES = /mangaupdates/i;

class NewBookmarkPanel extends Component<Props, State> {
  state = {
    bookmarkFetchState: 'UNREADY',
    errorCode: null,
    isFetchingPreview: false,
    isPreviewing: false,
    linkToUrl: undefined,
    seriesUrl: null,
    seriesPreview: null,
  };

  static mapStateToProps = state => ({});

  static mapDispatchToProps = (dispatch: Dispatch) => ({
    addEntities(payload) {
      dispatch({ type: 'ADD_ENTITIES', payload });
    },
  });

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { addEntities, collectionSlug, onRequestClose } = this.props;
    const { bookmarkFetchState, errorCode, seriesUrl, linkToUrl } = this.state;

    if (bookmarkFetchState === 'SUBMITTING') {
      return;
    }

    this.handleSeriesUrlValidation();

    if (errorCode || !seriesUrl) {
      return;
    }

    this.setState({ bookmarkFetchState: 'SUBMITTING' });

    api
      .fetchAddBookmarkToCollection(
        collectionSlug,
        utils.normalizeUrl(seriesUrl),
        linkToUrl ? utils.normalizeUrl(linkToUrl) : null,
      )
      .then(response => {
        const normalized = normalize(response.data, {
          collection: schema.collection,
          series: schema.series,
        });

        addEntities(normalized.entities);
        this.setState({ bookmarkFetchState: 'ADDED' });
        setTimeout(() => {
          onRequestClose();
        }, 1000);
      })
      .catch(this.handleSubmitError);
  };

  handleSubmitError = (err: AxiosError) => {
    const errorCode = this.getErrorCode(err);
    this.setState({ bookmarkFetchState: 'UNREADY', errorCode });
  };

  handleSeriesUrlValidation = () => {
    const { bookmarkFetchState, isFetchingPreview, seriesUrl } = this.state;

    if (bookmarkFetchState === 'SUBMITTING') {
      return;
    }

    if (!seriesUrl) {
      this.setState({ errorCode: null });
      return;
    }

    const normalizedUrl = utils.normalizeUrl(seriesUrl);

    if (!utils.isUrl(normalizedUrl)) {
      this.setState({ errorCode: 'INVALID_URL' });
      return;
    }

    const domain = utils.getDomainName(normalizedUrl);
    const supportedSite = SUPPORTED_SITES.test(domain);

    if (!supportedSite) {
      this.setState({ errorCode: 'UNSUPPORTED_SITE' });
      return;
    }

    if (isFetchingPreview) {
      // If we're fetching, that means we're already checking and don't have
      // anything new to share.
      return;
    }

    this.setState({ errorCode: null, bookmarkFetchState: 'READY' });

    // this.setState({ isFetchingPreview: true });
    // utils
    //   .fetchSeriesByUrl(seriesUrl)
    //   .then(response => {
    //     this.setState({ isFetchingPreview: false, seriesPreview: response.data });
    //   })
    //   .catch(err => {
    //     this.setState({
    //       isFetchingPreview: false,
    //       seriesPreview: null,
    //       errorCode: 'INVALID_SERIES',
    //     });
    //   });
  };

  debouncedSeriesUrlValidation = debounce(500, this.handleSeriesUrlValidation);

  handleSeriesUrlChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ seriesUrl: e.currentTarget.value });
    this.debouncedSeriesUrlValidation();
  };

  handleLinkToUrlChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ linkToUrl: e.currentTarget.value });
    // TODO: add validation that this is a valid URL
  };

  seriesSupportsReading = (seriesUrl: string) => {
    return !LINK_TO_SITES.test(seriesUrl);
  };

  getErrorCode = (err: AxiosError): NewSeriesErrorCode => {
    if (!err.response) {
      return 'REQUEST_FAILED';
    }

    switch (err.response.status) {
      case 404:
        return 'SERIES_NOT_FOUND';
      case 400:
        return /already exists/i.test(err.response.data)
          ? 'SERIES_ALREADY_EXISTS'
          : 'INVALID_SERIES';
      default:
        return 'UNKNOWN_ERROR';
    }
  };

  getErrorMessage = (
    errorCode: ?NewSeriesErrorCode,
    seriesUrl: ?string,
  ): Node => {
    if (!errorCode) {
      return;
    }

    switch (errorCode) {
      case 'REQUEST_FAILED':
        return `There was an error reaching the server.`;
      case 'INVALID_URL':
        return `Hmm, this doesn't look like a URL.`;
      case 'UNSUPPORTED_SITE':
        const domain =
          seriesUrl && utils.isUrl(seriesUrl)
            ? utils.getDomainName(seriesUrl)
            : null;
        return (
          <span>
            Sorry,{' '}
            {domain && domain.length > 0 ? <strong>{domain}</strong> : 'that'}{' '}
            isn't a supported site. Here's{' '}
            <a
              className="Link"
              href={`${config.githubLibraryUrl}#supported-sites`}
              rel="noopener noreferrer"
              target="_blank">
              a full list of supported sites
            </a>. Make an issue{' '}
            <a
              className="Link"
              href={`${config.githubLibraryUrl}/issues/new`}
              rel="noopener noreferrer"
              target="_blank">
              on the Github repo
            </a>{' '}
            to request a new one.
          </span>
        );
      case 'INVALID_SERIES':
      case 'SERIES_NOT_FOUND':
        return `We couldn't find a series at that URL.`;
      case 'SERIES_ALREADY_EXISTS':
        return `That series is already in your collection!`;
      case 'UNKNOWN_ERROR':
        return 'Something went wrong fetching the series. Try again later.';
      default:
        return `Something went wrong.`;
    }
  };

  render() {
    const { onRequestClose } = this.props;
    const { bookmarkFetchState, errorCode, linkToUrl, seriesUrl } = this.state;

    const buttonLabelValues = {
      SUBMITTING: 'Adding...',
      READY: 'Add',
      UNREADY: 'Add',
      ADDED: <span>✓ Added</span>,
    };

    const disableFormFields =
      bookmarkFetchState === 'SUBMITTING' || bookmarkFetchState === 'ADDED';
    const showLinkToForm =
      seriesUrl &&
      utils.isUrl(seriesUrl) &&
      this.seriesSupportsReading(seriesUrl) === false;

    return (
      <Panel onRequestClose={onRequestClose}>
        <Panel.Content title="Add new series">
          <p className="mb-3">
            Paste the URL of the series you want to follow.{' '}
            <a
              href="https://github.com/poketo/site/wiki/Adding-a-New-Series"
              target="_blank"
              className="Link"
              rel="noopener noreferrer">
              (instructions)
            </a>
          </p>
          <form type="post" onSubmit={this.handleSubmit} noValidate>
            <div className="mb-2">
              <Input
                type="url"
                name="seriesUrl"
                readOnly={disableFormFields}
                onChange={this.handleSeriesUrlChange}
                placeholder="http://"
                value={seriesUrl || ''}
              />
            </div>
            {errorCode && (
              <p className="c-red fs-12 mb-2">
                {this.getErrorMessage(errorCode, seriesUrl)}
              </p>
            )}
            {seriesUrl &&
              showLinkToForm && (
                <Fragment>
                  <p className="mb-2">
                    <strong>{utils.getDomainName(seriesUrl)}</strong> doesn't
                    support reading on Poketo. You can add a different link to
                    open for reading.
                  </p>
                  <Input
                    type="url"
                    name="linkToUrl"
                    readOnly={disableFormFields}
                    onChange={this.handleLinkToUrlChange}
                    placeholder="Reading URL (optional)"
                    value={linkToUrl || ''}
                  />
                </Fragment>
              )}
            <Button
              primary
              disabled={bookmarkFetchState !== 'READY' || errorCode !== null}
              type="submit">
              {buttonLabelValues[bookmarkFetchState]}
            </Button>
          </form>
        </Panel.Content>
      </Panel>
    );
  }
}

export default connect(
  NewBookmarkPanel.mapStateToProps,
  NewBookmarkPanel.mapDispatchToProps,
)(NewBookmarkPanel);
