// @flow

import type { Context } from 'koa';
import poketo, { type ChapterMetadata, type Series } from 'poketo';

function getChapterLabel(chapter: ChapterMetadata): string {
  if (chapter.chapterNumber) {
    return `Chapter ${chapter.chapterNumber}`;
  }

  if (chapter.title) {
    return chapter.title;
  }

  if (chapter.volumeNumber) {
    return `Volume ${chapter.volumeNumber}`;
  }

  return 'Unknown';
}

function jsonFeedForSeries(series: Series) {
  /* eslint-disable camelcase */
  return {
    version: 'https://jsonfeed.org/version/1',
    title: series.title,
    description: series.description,
    author: {
      name: series.author,
    },
    home_page_url: series.url,
    feed_url: `https://api.poketo.app/feed/${series.id}.json`,
    favicon: 'https://poketo.app/favicon.png',
    expired: series.status === 'COMPLETED',
    items: series.chapters ? series.chapters.map(chapter => ({
      id: chapter.id,
      url: chapter.url,
      title: getChapterLabel(chapter),
      date_published: (new Date(chapter.createdAt * 1000)).toISOString(),
      content_html: 'Read this chapter at ' + chapter.url,
    })) : [],
  };
  /* eslint-enable camelcase */
}

export default async function(ctx: Context, id: string) {
  const type = poketo.getType(id);
  ctx.assert(type === 'series', 400, 'Please provide a valid Poketo ID.');
  const series = await poketo.getSeries(id);
  ctx.body = jsonFeedForSeries(series);
}
