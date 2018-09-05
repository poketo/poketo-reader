// @flow

import React, { Component } from 'react';
import styled from 'react-emotion';
import Loadable from 'react-loadable';

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

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);

  @media only screen and (min-width: 480px) {
    position: absolute;
    box-shadow: none;
  }
`;

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

  renderAddButton(inline: boolean = false) {
    const label = 'Add new series';
    const icon = <Icon name="add" {...iconProps} />;

    if (inline) {
      return (
        <Button
          inline
          noPadding
          onClick={this.openAddBookmarkPanel}
          title={label}>
          {icon}
        </Button>
      );
    }

    return (
      <Popover.Item
        label={label}
        onClick={this.openAddBookmarkPanel}
        iconBefore={icon}
      />
    );
  }

  renderClearCacheButton() {
    return (
      <Popover.Item
        label="Clear cache"
        onClick={this.handleClearCacheClick}
        iconBefore={<Icon name="refresh" {...iconProps} />}
      />
    );
  }

  renderFeedbackButton(inline: boolean = false) {
    const label = 'Send feedback';
    const icon = <Icon name="message" {...iconProps} />;

    if (inline) {
      return (
        <Button inline noPadding onClick={this.openFeedbackPanel} title={label}>
          {icon}
        </Button>
      );
    }

    return (
      <Popover.Item
        onClick={this.openFeedbackPanel}
        label={label}
        iconBefore={icon}
      />
    );
  }

  render() {
    return (
      <StyledHeader className="z-9 x xa-center xj-spaceBetween pr-2 fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <Icon name="poketo" className="c-coral" />
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
        <div className="d-none d-block-m">{this.renderAddButton(true)}</div>
        <Popover
          content={
            <div className="pa-2" style={{ maxWidth: '80vw' }}>
              {this.renderAddButton()}
              {this.renderClearCacheButton()}
              {this.renderFeedbackButton()}
              <Popover.Item
                iconBefore={<Icon name="new-tab" {...iconProps} />}
                label="Open Poketo site"
                href="/home"
              />
            </div>
          }
          position={Popover.Position.BOTTOM_RIGHT}>
          <div className="d-none-m">
            <Button inline noPadding>
              <Icon name="more-vertical" size={44} iconSize={20} />
            </Button>
          </div>
        </Popover>
      </StyledHeader>
    );
  }
}
