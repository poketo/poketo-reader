// flow-typed signature: daa97a6b11e76dc688accb5ce6105457
// flow-typed version: <<STUB>>/poketo_v^0.6.0/flow_v0.79.1

declare module 'poketo' {
  declare export type PublicationStatus = 'ONGOING' | 'COMPLETED' | 'UNKNOWN';

  declare export type Page = {
    id: string,
    url: string,
    width?: number,
    height?: number,
  };

  declare export type ChapterMetadata = {
    id: string,
    title: ?string,
    slug: string,
    url: string,
    order: number,
    chapterNumber: ?string,
    volumeNumber: ?string,
    createdAt: number,
  };

  declare export type Chapter = {
    ...$Exact<ChapterMetadata>,
    pages: Page[],
  };

  declare export type Series = {
    id: string,
    slug: string,
    url: string,
    title: string,
    description: ?string,
    author: ?string,
    status: PublicationStatus,
    coverImageUrl: ?string,
    site: {
      name: string,
      id: string,
    },
    supportsReading: boolean,
    chapters?: ChapterMetadata[],
    updatedAt: number,
  };

  declare export default {
    constructUrl: (id: string) => string,
    getId: (url: string) => string,
    getType: (idOrUrl: string) => 'series' | 'chapter',
    setDefaultHeaders: (headers: Object) => void,
    getSeries: (idOrUrl: string) => Promise<Series>,
    getChapter: (idOrUrl: string) => Promise<Chapter>,
  };
}

/**
 * We include stubs for each file inside this npm package in case you need to
 * require those files directly. Feel free to delete any files that aren't
 * needed.
 */

declare module 'poketo/supports' {
  declare export default (url: string) => boolean;
}
