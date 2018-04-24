// @flow

import React, { Component, Fragment, type Node } from 'react';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import debounce from 'throttle-debounce/debounce';
import Button from '../components/button';
import Input from '../components/input';
import Panel from '../components/panel';
import api, { type AxiosError } from '../api';
import utils from '../utils';

import schema from '../store/schema';

import type { Series } from '../types';
import type { Dispatch, EntitiesPayload } from '../store/types';

type NewSeriesErrorCode =
  | 'INVALID_SERIES'
  | 'INVALID_URL'
  | 'UNSUPPORTED_SITE'
  | 'SERVER_NOT_FOUND'
  | 'SERVER_ALREADY_EXISTS'
  | 'SERVER_UNKNOWN_ERROR';

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
const SUPPORTED_SITES = /mangadex|mangahere|mangakakalot|mangaupdates|helveticascans|merakiscans/i;
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
    let errorCode;

    switch (err.response.status) {
      case 404:
        errorCode = 'SERVER_NOT_FOUND';
        break;
      case 400:
        errorCode = /already exists/i.test(err.response.data)
          ? 'SERVER_ALREADY_EXISTS'
          : 'INVALID_SERIES';
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
              href="https://github.com/poketo/service/tree/master/lib/api#supported-sites"
              rel="noopener noreferrer"
              target="_blank">
              a full list of supported sites
            </a>. Make an issue{' '}
            <a
              className="Link"
              href="https://github.com/poketo/service/issues/new"
              rel="noopener noreferrer"
              target="_blank">
              on the Github repo
            </a>{' '}
            to request a new one.
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
          <p className="mb-3">Paste the URL of a series you want to follow.</p>
          <form type="post" onSubmit={this.handleSubmit} noValidate>
            <div className="mb-2">
              <Input
                type="url"
                name="seriesUrl"
                readOnly={disableFormFields}
                onChange={this.handleSeriesUrlChange}
                placeholder="Paste series URL"
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
        </div>
      </Panel>
    );
  }
}

export default connect(
  NewBookmarkPanel.mapStateToProps,
  NewBookmarkPanel.mapDispatchToProps,
)(NewBookmarkPanel);
