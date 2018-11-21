// @flow

import React, { Component, Fragment } from 'react';
import type { Page } from 'poketo';
import mostCommon from 'array-most-common';
import type { PageDimensions } from '../types';
import ReaderPageImage from '../components/reader-page-image';

type PageListProps = {
  pages: Page[],
};

type PageListState = {
  defaultPageWidth?: number,
  defaultPageHeight?: number,
};

function serializeDimension(dimension: PageDimensions) {
  return `${dimension.width}:${dimension.height}`;
}

function unserializeDimension(dimension: string) {
  const [width, height] = dimension.split(':');
  return { width, height };
}

function getMostCommonPageDimensions(
  dimensions: PageDimensions[],
): PageDimensions {
  if (dimensions.length < 2) {
    // If there's less than 3 pages, getting the most common dimensions is
    // likely to be wrong, since the first few scans of a chapter often have
    // title/introductory pages which are different ratios.
    return { width: undefined, height: undefined };
  }

  const serializedDimensions = dimensions.map(serializeDimension);
  const mostCommonSerialized = mostCommon(serializedDimensions);
  const mostCommonDimension = unserializeDimension(mostCommonSerialized);

  return mostCommonDimension;
}

export default class ReaderPageImageList extends Component<
  PageListProps,
  PageListState,
> {
  state = {
    defaultPageWidth: undefined,
    defaultPageHeight: undefined,
  };

  pageSizes: PageDimensions[] = [];

  handleImageDimensionsLoad = (dimensions: PageDimensions) => {
    this.pageSizes.push(dimensions);

    const {
      width: defaultPageWidth,
      height: defaultPageHeight,
    } = getMostCommonPageDimensions(this.pageSizes);

    if (
      defaultPageWidth !== this.state.defaultPageWidth ||
      defaultPageHeight !== this.state.defaultPageHeight
    ) {
      this.setState({ defaultPageWidth, defaultPageHeight });
    }
  };

  render() {
    const { pages } = this.props;
    const { defaultPageWidth, defaultPageHeight } = this.state;

    return (
      <Fragment>
        {pages.map(page => (
          <div key={page.id} className="mb-2 mb-3-m">
            <ReaderPageImage
              page={page}
              defaultWidth={defaultPageWidth}
              defaultHeight={defaultPageHeight}
              onImageDimensionsLoad={this.handleImageDimensionsLoad}
            />
          </div>
        ))}
      </Fragment>
    );
  }
}
