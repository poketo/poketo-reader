// @flow

// $FlowFixMe: Flow doesn't support React 16.6 features
import React, { Fragment, Component, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { css, cx } from 'react-emotion/macro';
import type { ChapterMetadata, Series } from 'poketo';

import BackButtonContainer from '../components/back-button-container';
import ComponentLoader from '../components/loader-component';
import ReaderNavigation from '../components/reader-navigation';
import ScrollHide from '../components/scroll-hide';
import Icon from '../components/icon';
import Panel from '../components/panel';
import Popover from '../components/popover';
import type { Collection } from '../types';
import type { Bookmark } from '../../shared/types';
import utils from '../utils';

const LazyFeedbackForm = lazy(() => import('../components/feedback-form'));

type Props = {
  bookmark?: Bookmark,
  collection?: Collection,
  seriesId: string,
  series?: Series,
  chapter: ChapterMetadata,
  seriesChapters: ChapterMetadata[],
  onMarkAsReadClick: () => void,
};

type State = {
  isFeedbackPanelOpen: boolean,
};

const iconProps = {
  iconSize: 20,
  size: 44,
};

const popoverContentClassName = css`
  max-width: 80vw;
`;

const headerClassName = css`
  transition: transform 200ms ease;
`;

const isHeaderHidden = css`
  transform: translateY(-100%);
`;

export default class ReaderHeader extends Component<Props, State> {
  state = {
    isFeedbackPanelOpen: false,
  };

  handleOpenFeedbackPanelClick = () => {
    this.setState({ isFeedbackPanelOpen: true });
  };

  handleFeedbackPanelRequestClose = () => {
    this.setState({ isFeedbackPanelOpen: false });
  };

  render() {
    const {
      bookmark,
      collection,
      chapter,
      series,
      seriesId,
      seriesChapters,
    } = this.props;

    return (
      <ScrollHide>
        {({ isActive }) => (
          <Fragment>
            <Panel
              isShown={this.state.isFeedbackPanelOpen}
              onRequestClose={this.handleFeedbackPanelRequestClose}>
              {() => (
                <Panel.Content title="Report an issue">
                  <Suspense fallback={<ComponentLoader />}>
                    <LazyFeedbackForm
                      onSubmitSuccess={this.handleFeedbackPanelRequestClose}>
                      <p>Something look off with this chapter? Let us know.</p>
                    </LazyFeedbackForm>
                  </Suspense>
                </Panel.Content>
              )}
            </Panel>
            <div
              className={cx(
                'p-fixed t-0 w-100p z-3 x xj-spaceBetween bgc-black c-white pv-3 ph-3',
                headerClassName,
                {
                  [isHeaderHidden]: !isActive,
                },
              )}>
              <BackButtonContainer>
                {({ to }) => (
                  <Link className="x xa-center o-50p z-2" to={to}>
                    <Icon name="arrow-left" iconSize={20} />
                  </Link>
                )}
              </BackButtonContainer>

              {series && (
                <div className="p-absolute p-fill ph-5 x xa-center xj-center">
                  <ReaderNavigation
                    chapter={chapter}
                    collection={collection}
                    bookmark={bookmark}
                    series={series}
                    seriesChapters={seriesChapters}
                  />
                </div>
              )}
              <Popover
                content={({ close }) => (
                  <div className={cx('pa-2', popoverContentClassName)}>
                    {series && (
                      <Fragment>
                        <Link
                          className="br-3 x xa-center ta-left ph-3 pv-2 hover-bg lh-1d25"
                          to={utils.getSeriesUrl(seriesId)}>
                          <div>
                            <div className="fw-semibold">{series.title}</div>
                            <div className="fs-14 c-gray3">
                              {series.site.name}
                            </div>
                          </div>
                        </Link>
                        <Popover.Divider />
                        {chapter && (
                          <Popover.Item
                            iconBefore={<Icon name="new-tab" {...iconProps} />}
                            label={`Open on ${series.site.name}`}
                            href={chapter.url}
                            onClick={close}
                            target="_blank"
                            rel="noreferrer noopener"
                          />
                        )}
                        {collection && (
                          <Popover.Item
                            iconBefore={<Icon name="bookmark" {...iconProps} />}
                            label="Mark read at this chapter"
                            onClick={() => {
                              close();
                              this.props.onMarkAsReadClick();
                            }}
                          />
                        )}
                        <Popover.Divider />
                        <Popover.Item
                          iconBefore={<Icon name="flag" {...iconProps} />}
                          label="Report an issue"
                          onClick={() => {
                            close();
                            this.handleOpenFeedbackPanelClick();
                          }}
                        />
                      </Fragment>
                    )}
                  </div>
                )}
                position={Popover.Position.BOTTOM_RIGHT}>
                <button className="x xa-center o-50p z-2">
                  <Icon name="more-vertical" iconSize={20} />
                </button>
              </Popover>
            </div>
          </Fragment>
        )}
      </ScrollHide>
    );
  }
}
