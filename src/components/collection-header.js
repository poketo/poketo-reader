// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Loadable from 'react-loadable';

import Button from './button';
import ComponentLoader from './loader-component';
import Icon from './icon';
import Panel from './panel';
import NewBookmarkPanel from './collection-new-bookmark-panel';
import Popover from './popover/index';
import cache from '../store/cache';

import './collection-header.css';

const LoadableFeedbackForm = Loadable({
  loader: () => import('../containers/feedback-form'),
  loading: ComponentLoader,
});

type Props = {
  collectionSlug: string,
};

type State = {
  isFeedbackPanelShown: boolean,
  isBookmarkPanelShown: boolean,
};

export default class CollectionHeader extends PureComponent<Props, State> {
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
    const icon = <Icon name="add" iconSize={18} size={44} />;

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
        iconBefore={<Icon name="refresh" iconSize={18} size={44} />}
      />
    );
  }

  renderFeedbackButton(inline: boolean = false) {
    const label = 'Send feedback';
    const icon = <Icon name="message" iconSize={18} size={44} />;

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
    const { collectionSlug: slug } = this.props;

    return (
      <header className="CollectionHeader z-9 x xa-center xj-spaceBetween pr-2 fs-14 fs-16-m bgc-fadedOffWhite status-bar-ios-offset">
        <div className="x xa-center pv-3 ph-3">
          <Icon name="poketo" className="c-coral" />
        </div>
        <div>
          <Link to={`/c/${slug}/releases`}>Releases</Link>
          <Link className="ml-3" to={`/c/${slug}/library`}>
            Library
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
        <div className="d-none d-block-m">{this.renderAddButton(true)}</div>
        <Popover
          content={
            <div className="pa-2" style={{ maxWidth: '80vw' }}>
              {this.renderAddButton()}
              {this.renderClearCacheButton()}
              {this.renderFeedbackButton()}
            </div>
          }
          position={Popover.Position.BOTTOM_RIGHT}>
          <div className="d-none-m">
            <Button inline noPadding>
              <Icon name="more-vertical" size={44} iconSize={20} />
            </Button>
          </div>
        </Popover>
      </header>
    );
  }
}
