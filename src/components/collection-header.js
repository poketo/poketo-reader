// @flow

// $FlowFixMe: Flow doesn't support React 16.6 features
import React, { Component, Fragment, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { css, cx } from 'react-emotion/macro';
import { connect } from 'react-redux';

import Button from './button';
import ComponentLoader from './loader-component';
import FetchCollection from './fetch-collection';
import Icon from './icon';
import Panel from './panel';
import Popover from './popover/index';
import cache from '../store/cache';
import { clearDefaultCollection } from '../store/reducers/navigation';

const LazyNewBookmarkPanel = lazy(() =>
  import('../components/collection-new-bookmark-panel'),
);
const LazyFeedbackForm = lazy(() => import('../components/feedback-form'));

const iconProps = { iconSize: 18, size: 44 };
const contentClassName = css`
  max-width: 80vw;
`;

type Props = {};

type State = {
  isFeedbackPanelShown: boolean,
  isBookmarkPanelShown: boolean,
};

class CollectionHeader extends Component<Props, State> {
  state = {
    isFeedbackPanelShown: false,
    isBookmarkPanelShown: false,
  };

  openAddBookmarkPanel = () => {
    this.setState({ isBookmarkPanelShown: true });
  };

  closeAddBookmarkPanel = () => {
    this.setState({ isBookmarkPanelShown: false });
  };

  openFeedbackPanel = () => {
    this.setState({ isFeedbackPanelShown: true });
  };

  closeFeedbackPanel = () => {
    this.setState({ isFeedbackPanelShown: false });
  };

  handleFeedbackSubmitSuccess = () => {
    setTimeout(() => {
      this.closeFeedbackPanel();
    }, 1000);
  };

  handleClearCacheClick = () => {
    cache.clear().then(() => {
      window.location.reload();
    });
  };

  render() {
    return (
      <header className="x xa-center xj-spaceBetween pr-2 fs-14 fs-16-m status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <Link to="/">
            <Icon name="poketo" className="c-coral va-top" />
          </Link>
        </div>
        <Panel
          isShown={this.state.isFeedbackPanelShown}
          onRequestClose={this.closeFeedbackPanel}>
          {() => (
            <Panel.Content title="Feedback">
              <Suspense fallback={<ComponentLoader />}>
                <LazyFeedbackForm
                  onSubmitSuccess={this.handleFeedbackSubmitSuccess}
                />
              </Suspense>
            </Panel.Content>
          )}
        </Panel>
        <Panel
          isShown={this.state.isBookmarkPanelShown}
          onRequestClose={this.closeAddBookmarkPanel}>
          {() => (
            <Suspense fallback={<ComponentLoader />}>
              <LazyNewBookmarkPanel
                onRequestClose={this.closeAddBookmarkPanel}
              />
            </Suspense>
          )}
        </Panel>
        <Popover
          content={({ close }) => (
            <div className={cx('pa-2', contentClassName)}>
              <FetchCollection>
                {({ collection }) =>
                  collection ? (
                    <Fragment>
                      <Popover.Item
                        label="Follow new series"
                        onClick={() => {
                          this.openAddBookmarkPanel();
                          close();
                        }}
                        iconBefore={<Icon name="add" {...iconProps} />}
                      />
                      <Popover.Divider />
                    </Fragment>
                  ) : null
                }
              </FetchCollection>
              <Popover.Item
                label="Clear cache"
                onClick={() => {
                  this.handleClearCacheClick();
                  close();
                }}
                iconBefore={<Icon name="refresh" {...iconProps} />}
              />
              <Popover.Item
                label="Export data"
                href="/settings/export"
                onClick={close}
                iconBefore={<Icon name="archive" {...iconProps} />}
              />
              <Popover.Item
                onClick={() => {
                  this.openFeedbackPanel();
                  close();
                }}
                label="Send feedback"
                iconBefore={<Icon name="message" {...iconProps} />}
              />
              <Popover.Divider />
              <Popover.Item
                href="/logout"
                label="Log out"
                iconBefore={<Icon name="log-out" {...iconProps} />}
              />
            </div>
          )}
          position={Popover.Position.BOTTOM_RIGHT}>
          <Button inline noPadding>
            <Icon name="more-vertical" size={44} iconSize={20} />
          </Button>
        </Popover>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    logout() {
      dispatch(clearDefaultCollection());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CollectionHeader);
