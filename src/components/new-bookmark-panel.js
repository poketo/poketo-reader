// @flow

import React, { Component, Fragment, type Node } from 'react';
import debounce from 'throttle-debounce/debounce';
import EntityContainer from '../containers/entity-container';
import Button from './button';
import Input from './input';
import Panel from './panel';
import utils from '../utils';

import type { Series, TraeError } from '../types';

type NewSeriesErrorCode =
  | 'INVALID_URL'
  | 'UNSUPPORTED_SITE'
  | 'INVALID_SERIES'
  | 'SERVER_NOT_FOUND'
  | 'SERVER_ALREADY_EXISTS'
  | 'SERVER_UNKNOWN_ERROR';

type BookmarkFetchState = 'ADDED' | 'READY' | 'SUBMITTING' | 'UNREADY';

type Props = {
  collectionSlug: string,
  onRequestClose: () => void,
  store: EntityContainer,
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
const SUPPORTED_SITES = /mangahere|mangakakalot|mangaupdates|helveticascans|merakiscans/i;
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

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { collectionSlug, store, onRequestClose } = this.props;
    const { bookmarkFetchState, errorCode, seriesUrl, linkToUrl } = this.state;

    if (bookmarkFetchState === 'SUBMITTING') {
      return;
    }

    this.handleSeriesUrlValidation();

    if (errorCode || !seriesUrl) {
      return;
    }

    this.setState({ bookmarkFetchState: 'SUBMITTING' });

    utils
      .fetchAddBookmarkToCollection(collectionSlug, seriesUrl, linkToUrl)
      .then(response => {
        const collection = {
          slug: response.data.collection.slug,
          bookmarks: utils.keyArrayBy(
            response.data.collection.bookmarks,
            obj => obj.id,
          ),
        };
        store.addBookmarkToCollection(
          collectionSlug,
          collection,
          response.data.series,
        );
        this.setState({ bookmarkFetchState: 'ADDED' });
        setTimeout(() => {
          onRequestClose();
        }, 1000);
      })
      .catch(this.handleSubmitError);
  };

  handleSubmitError = (err: TraeError) => {
    let errorCode;

    switch (err.status) {
      case 404:
        errorCode = 'SERVER_NOT_FOUND';
        break;
      case 400:
        errorCode = /already exists/i.test(err.data)
          ? 'SERVER_ALREADY_EXISTS'
          : 'SERVER_UNKNOWN_ERROR';
        break;
      default:
        errorCode = 'SERVER_UNKNOWN_ERROR';
        break;
    }

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

    if (!utils.isUrl(seriesUrl)) {
      this.setState({ errorCode: 'INVALID_URL' });
      return;
    }

    const domain = utils.getDomainName(seriesUrl);
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

  getErrorMessage = (
    errorCode: NewSeriesErrorCode,
    seriesUrl: ?string,
  ): Node => {
    if (!errorCode) {
      return;
    }

    switch (errorCode) {
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
              href="https://github.com/rosszurowski/poketo-lib#readme"
              rel="noopener noreferrer"
              target="_blank">
              a full list of supported sites
            </a>. Make an issue{' '}
            <a
              className="Link"
              href="https://github.com/rosszurowski/poketo-lib/issues"
              rel="noopener noreferrer"
              target="_blank">
              here
            </a>{' '}
            if you'd like to request another.
          </span>
        );
      case 'INVALID_SERIES':
      case 'SERVER_NOT_FOUND':
        return `We couldn't find a series at that URL.`;
      case 'SERVER_ALREADY_EXISTS':
        return `That series is already in your collection!`;
      case 'SERVER_UNKNOWN_ERROR':
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
        <div className="ph-3 pt-3 pb-5">
          <h3 className="fw-medium">New series</h3>
          <p>Paste the URL of a series you want to follow.</p>
          <form type="post" onSubmit={this.handleSubmit} noValidate>
            <Input
              type="url"
              name="seriesUrl"
              readOnly={disableFormFields}
              onChange={this.handleSeriesUrlChange}
              placeholder="Paste series URL"
              value={seriesUrl || ''}
            />
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
        </div>
      </Panel>
    );
  }
}

export default NewBookmarkPanel;
