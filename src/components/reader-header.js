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
  loader: () => import('../components/feedback-form'),
  loading: ComponentLoader,
});

type Props = {
  collectionSlug: ?string,
  seriesTitle: ?string,
  seriesSiteName: ?string,
  seriesUrl: ?string,
  chapterUrl: ?string,
};

type State = {
  isFeedbackPanelOpen: boolean,
};

const iconProps = {
  iconSize: 20,
  size: 44,
};

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
    const {
      collectionSlug,
      seriesTitle,
      seriesSiteName,
      seriesUrl,
      chapterUrl,
    } = this.props;

    return (
      <Fragment>
        <Panel
          isShown={this.state.isFeedbackPanelOpen}
          onRequestClose={this.handleFeedbackPanelRequestClose}>
          {() => (
            <Panel.Content title="Report an issue">
              <LoadableFeedbackForm
                onSubmitSuccess={this.handleFeedbackPanelRequestClose}>
                <p>Something look off with this chapter? Let us know.</p>
              </LoadableFeedbackForm>
            </Panel.Content>
          )}
        </Panel>
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
                <div className="ph-3 pv-1">
                  <div>{seriesTitle}</div>
                  <div className="fs-14 c-gray3">{seriesSiteName}</div>
                </div>
                <Popover.Divider />
                {seriesSiteName && (
                  <Fragment>
                    {seriesUrl && (
                      <Popover.Item
                        iconBefore={<Icon name="new-tab" {...iconProps} />}
                        label="Open series on site"
                        href={seriesUrl}
                        onClick={close}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    )}
                    {chapterUrl && (
                      <Popover.Item
                        iconBefore={<Icon name="new-tab" {...iconProps} />}
                        label="Open chapter on site"
                        href={chapterUrl}
                        onClick={close}
                        target="_blank"
                        rel="noreferrer noopener"
                      />
                    )}
                    <Popover.Divider />
                  </Fragment>
                )}
                <Popover.Item
                  iconBefore={<Icon name="flag" {...iconProps} />}
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
