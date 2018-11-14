// @flow

// $FlowFixMe: Flow doesn't support React 16.6 features
import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { css, cx } from 'react-emotion/macro';
import type { Series } from 'poketo';

import BackButtonContainer from '../components/back-button-container';
import ComponentLoader from '../components/loader-component';
import Icon from '../components/icon';
import Panel from '../components/panel';
import Popover from '../components/popover';
import utils from '../utils';

const LazyFeedbackForm = lazy(() => import('../components/feedback-form'));

type Props = {
  collectionSlug: ?string,
  seriesId: string,
  series: ?Series,
  chapterUrl: ?string,
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

export default class ReaderHeader extends PureComponent<Props, State> {
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
    const { collectionSlug, series, seriesId, chapterUrl } = this.props;

    return (
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
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-3 ph-3">
          <BackButtonContainer>
            {({ to }) => (
              <Link className="x xa-center o-50p z-2" to={to}>
                <Icon name="arrow-left" iconSize={20} />
              </Link>
            )}
          </BackButtonContainer>

          {series && (
            <div className="p-absolute p-fill ph-5 x xa-center xj-center">
              <span className="of-hidden to-ellipsis ws-noWrap">
                {series.title}
              </span>
            </div>
          )}
          <Popover
            content={({ close }) => (
              <div className={cx('pa-2', popoverContentClassName)}>
                {series && (
                  <Fragment>
                    <Link
                      className="br-3 x xa-center ta-left ph-3 pv-1 hover-bg"
                      to={utils.getSeriesUrl(seriesId)}>
                      <div>
                        <div>{series.title}</div>
                        <div className="fs-14 c-gray3">{series.site.name}</div>
                      </div>
                    </Link>
                    <Popover.Divider />
                    {chapterUrl && (
                      <Popover.Item
                        iconBefore={<Icon name="new-tab" {...iconProps} />}
                        label={`Open on ${series.site.name}`}
                        href={chapterUrl}
                        onClick={close}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    )}
                    {collectionSlug && (
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
    );
  }
}
