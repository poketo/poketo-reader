// @flow

import React, { Fragment, PureComponent } from 'react';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';

import ComponentLoader from '../components/loader-component';
import Icon from '../components/icon';
import Panel from '../components/panel';
import Popover from '../components/popover';
import utils from '../utils';

const LoadableFeedbackForm = Loadable({
  loader: () => import('../containers/feedback-form'),
  loading: ComponentLoader,
});

type Props = {
  collectionSlug: ?string,
  seriesTitle: ?string,
  seriesSiteName: ?string,
  chapterUrl: ?string,
};

type State = {
  isFeedbackPanelOpen: boolean,
};

export default class ReaderHeader extends PureComponent<Props, State> {
  state = {
    isFeedbackPanelOpen: false,
  };

  handleOpenFeedbackPanelClick = () => {
    this.setState({ isFeedbackPanelOpen: true });
  };

  handleFeedbackPanelClose = () => {
    this.setState({ isFeedbackPanelOpen: false });
  };

  renderFeedbackPanel() {
    if (!this.state.isFeedbackPanelOpen) {
      return null;
    }

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.handleFeedbackPanelClose}>
          <Panel.Content title="Report an issue">
            <LoadableFeedbackForm
              onSubmitSuccess={this.handleFeedbackPanelClose}>
              <p>Something look off with this chapter? Let us know.</p>
            </LoadableFeedbackForm>
          </Panel.Content>
        </Panel>
      </Panel.Transition>
    );
  }

  render() {
    const {
      collectionSlug,
      seriesTitle,
      seriesSiteName,
      chapterUrl,
    } = this.props;

    return (
      <Fragment>
        <Panel.TransitionGroup>
          {this.renderFeedbackPanel()}
        </Panel.TransitionGroup>
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-3 ph-3">
          <Link
            className="x xa-center o-50p z-2"
            to={collectionSlug ? utils.getCollectionUrl(collectionSlug) : '/'}>
            <Icon name="arrow-left" iconSize={20} />
          </Link>
          {seriesTitle && (
            <div className="p-absolute p-fill ph-5 x xa-center xj-center">
              <span className="of-hidden to-ellipsis ws-noWrap">
                {seriesTitle}
              </span>
            </div>
          )}
          <Popover
            content={({ close }) => (
              <div className="pa-2" style={{ maxWidth: '80vw' }}>
                {seriesSiteName &&
                  chapterUrl && (
                    <Popover.Item
                      iconBefore={
                        <Icon name="new-tab" iconSize={24} size={44} />
                      }
                      label={`Open on ${seriesSiteName}`}
                      href={chapterUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    />
                  )}
                <Popover.Item
                  iconBefore={<Icon name="flag" iconSize={24} size={44} />}
                  label="Report an issue"
                  onClick={() => {
                    close();
                    this.handleOpenFeedbackPanelClick();
                  }}
                />
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
