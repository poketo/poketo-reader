// @flow

import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';
import Button from './button';
import ComponentLoader from './loader-component';
import Icon from './icon';
import Panel from './panel';
import NewBookmarkPanel from './collection-new-bookmark-panel';
import Popover from './popover/index';
import cache from '../store/cache';

const LoadableFeedbackForm = Loadable({
  loader: () => import('../components/feedback-form'),
  loading: ComponentLoader,
});

const iconProps = { iconSize: 18, size: 44 };

type Props = {
  collectionSlug: string,
};

type State = {
  isFeedbackPanelShown: boolean,
  isBookmarkPanelShown: boolean,
};

export default class CollectionHeader extends Component<Props, State> {
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
              <LoadableFeedbackForm
                onSubmitSuccess={this.handleFeedbackSubmitSuccess}
              />
            </Panel.Content>
          )}
        </Panel>
        <Panel
          isShown={this.state.isBookmarkPanelShown}
          onRequestClose={this.closeAddBookmarkPanel}>
          {() => (
            <NewBookmarkPanel
              collectionSlug={this.props.collectionSlug}
              onRequestClose={this.closeAddBookmarkPanel}
            />
          )}
        </Panel>
        <Popover
          content={({ close }) => (
            <div className="pa-2" style={{ maxWidth: '80vw' }}>
              <Popover.Item
                label="Follow new series"
                onClick={() => {
                  this.openAddBookmarkPanel();
                  close();
                }}
                iconBefore={<Icon name="add" {...iconProps} />}
              />
              <Popover.Divider />
              <Popover.Item
                label="Clear cache"
                onClick={() => {
                  this.handleClearCacheClick();
                  close();
                }}
                iconBefore={<Icon name="refresh" {...iconProps} />}
              />
              <Popover.Item
                onClick={() => {
                  this.openFeedbackPanel();
                  close();
                }}
                label="Send feedback"
                iconBefore={<Icon name="message" {...iconProps} />}
              />
              <Popover.Item
                onClick={close}
                iconBefore={<Icon name="new-tab" {...iconProps} />}
                label="Open Poketo site"
                href="/home"
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
