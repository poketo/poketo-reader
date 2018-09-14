// @flow

import React, { Fragment } from 'react';
import styled, { cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import CoverImage from './series-cover-image';
import Icon from './icon';
import utils from '../utils';
import type { FeedItem } from '../types';

const CoverImageContainer = styled.div`
  max-width: ${props => (props.compact ? '60px' : '80px')};
  flex: 1 0 50%;

  @media only screen and (min-width: 768px) {
    max-width: ${props => (props.compact ? '80px' : '120px')};
  }
`;

const NewReleaseIndicator = ({ className }: { className?: string }) => (
  <span
    className={cx(className, 'p-relative d-inlineBlock br-round bgc-coral')}
    css="top: -1px; width: 6px; height: 6px; flex-basis: 6px; flex-shrink: 0;"
  />
);

type NextChapterRowProps = {
  chapter: ChapterMetadata,
  isNewRelease: boolean,
  isRead: boolean,
};

const NextChapterRow = ({ chapter, isNewRelease }: NextChapterRowProps) => {
  const chapterLabel = utils.getChapterLabel(chapter, true);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  return (
    <Link
      to={to}
      className="fs-14 x xa-center pa-2 hover-bg ws-noWrap"
      css="min-height: 44px">
      <div className="xs-1 of-hidden to-ellipsis">
        <div
          className={cx('fw-semibold lh-1d25', {
            'c-coral': isNewRelease,
          })}>
          {isNewRelease && <NewReleaseIndicator css="margin-right: 6px;" />}
          {chapterLabel}
        </div>
        {chapterTitle && <div className="fs-12 o-50p">{chapterTitle}</div>}
      </div>
      <span className="pl-1 ml-auto fs-12 o-50p ta-right">
        <Icon name="arrow-right" iconSize={16} />
      </span>
    </Link>
  );
};

type Props = {
  className?: string,
  collectionSlug: string,
  feedItem: FeedItem,
  showChapters?: boolean,
};

const SeriesRow = ({
  className,
  collectionSlug,
  feedItem: item,
  showChapters = false,
}: Props) => {
  const seriesTo = utils.getSeriesUrl(item.series.id);

  const mostRecentChapter = item.chapters[0];
  const lastChapter = utils.lastReadChapter(
    item.chapters,
    item.lastReadChapterId,
  );
  const nextChapter = utils.nextChapterToRead(
    item.chapters,
    item.lastReadChapterId,
  );

  const isExternalLink = seriesTo.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink
    ? { href: seriesTo, target: '_blank' }
    : { to: seriesTo };

  return (
    <div className={cx(className)}>
      <Component
        {...linkProps}
        className="c-pointer x xa-center pa-2 pv-2 hover-bg">
        <CoverImageContainer className="mr-2 mr-3-m" compact={showChapters}>
          <CoverImage series={item.series} compact={showChapters} />
        </CoverImageContainer>
        <div className="xs-1 w-100p of-hidden">
          <div className="fs-16 fs-20-m fw-semibold lh-1d25 of-hidden to-ellipsis ws-noWrap">
            {item.series.title}
          </div>
          <div className="fs-12 o-50p">
            {item.series.site.name}
            {isExternalLink && <Icon name="new-tab" iconSize={12} size={12} />}
          </div>
        </div>
      </Component>
      {showChapters && (
        <Fragment>
          {nextChapter && (
            <NextChapterRow
              chapter={nextChapter}
              isNewRelease={item.newReleases.includes(nextChapter.id)}
              isRead={false}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default SeriesRow;
