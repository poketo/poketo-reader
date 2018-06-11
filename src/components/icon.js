// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import IconAdd from './icon-add';
import IconArrowLeft from './icon-arrow-left';
import IconArrowRight from './icon-arrow-right';
import IconBook from './icon-book';
import IconBookmark from './icon-bookmark';
import IconCheckCircle from './icon-check-circle';
import IconCheck from './icon-check';
import IconDirectDown from './icon-direct-down';
import IconEdit from './icon-edit';
import IconFeed from './icon-feed';
import IconMessage from './icon-message';
import IconMoreHorizontal from './icon-more-horizontal';
import IconNewTab from './icon-new-tab';
import IconPoketo from './icon-poketo';
import IconRefresh from './icon-refresh';
import IconTrash from './icon-trash';

const Icons = {
  add: IconAdd,
  'arrow-left': IconArrowLeft,
  'arrow-right': IconArrowRight,
  book: IconBook,
  bookmark: IconBookmark,
  'check-circle': IconCheckCircle,
  check: IconCheck,
  'direct-down': IconDirectDown,
  edit: IconEdit,
  feed: IconFeed,
  message: IconMessage,
  'more-horizontal': IconMoreHorizontal,
  'new-tab': IconNewTab,
  poketo: IconPoketo,
  refresh: IconRefresh,
  trash: IconTrash,
};

type IconKey = $Keys<typeof Icons>;

type Props = {
  className?: string,
  name: IconKey,
  iconSize: number,
  size: number,
};

export default class Icon extends PureComponent<Props> {
  static defaultProps = {
    iconSize: 24,
    size: 24,
  };

  render() {
    const { className, name, iconSize, size } = this.props;
    const Component = Icons[name];

    return (
      <span
        className={classNames('xj-center xa-center', className)}
        style={{ display: 'inline-flex', width: size, height: size }}>
        <Component width={iconSize} height={iconSize} />
      </span>
    );
  }
}
