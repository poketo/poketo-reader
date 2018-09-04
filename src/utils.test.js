import utils from './utils';

describe('utils', () => {
  describe('sorting utils', () => {
    const chapterA = { id: 'site:series:14616', order: 0 };
    const chapterB = { id: 'site:series:14618', order: 1 };
    const chapterC = { id: 'site:series:14617', order: 2 };
    const chapterD = { id: 'site:series:14619', order: 3 };
    const chapters = [chapterA, chapterB, chapterD, chapterC];

    describe('sortChapters', () => {
      it('sorts chapters in descending order', () => {
        expect(utils.sortChapters(chapters)).toEqual([
          chapterD,
          chapterC,
          chapterB,
          chapterA,
        ]);
      });
    });

    describe('getUnreadChapters', () => {
      it('returns every chapter later in the order, excluding the last read', () => {
        expect(utils.getUnreadChapters(chapters, 'site:series:14619')).toEqual(
          [],
        );

        expect(utils.getUnreadChapters(chapters, 'site:series:14617')).toEqual([
          chapterD,
        ]);

        expect(utils.getUnreadChapters(chapters, 'site:series:14616')).toEqual([
          chapterD,
          chapterC,
          chapterB,
        ]);
      });

      it('returns every chapter if the last read chapter id is null', () => {
        expect(utils.getUnreadChapters(chapters, null)).toEqual([
          chapterD,
          chapterC,
          chapterB,
          chapterA,
        ]);
      });
    });

    describe('getReadChapters', () => {
      it('returns every chapter up to and including the last read chapter id', () => {
        expect(utils.getReadChapters(chapters, 'site:series:14618')).toEqual([
          chapterB,
          chapterA,
        ]);

        expect(utils.getReadChapters(chapters, 'site:series:14619')).toEqual([
          chapterD,
          chapterC,
          chapterB,
          chapterA,
        ]);
      });

      it('returns no chapters if the last read chapter id is null', () => {
        expect(utils.getReadChapters(chapters, null)).toEqual([]);
      });
    });
  });

  describe('chapter utils', () => {
    const standardChapter = {
      slug: '105',
      chapterNumber: '105',
      volumeNumber: '3',
      title: 'Title',
    };

    const chapterWithoutNumber = {
      slug: '105',
      volumeNumber: '3',
      title: 'Oneshot',
    };

    const chapterWithOnlyVolume = {
      volumeNumber: 10,
    };

    describe('getChapterLabel', () => {
      it('returns a formatted chapter number', () => {
        expect(utils.getChapterLabel(standardChapter, true)).toEqual(
          'Chapter 105',
        );
      });

      it('returns the chapter title when no chapter number exists', () => {
        expect(utils.getChapterLabel(chapterWithoutNumber, true)).toEqual(
          'Oneshot',
        );
      });

      it('returns the volume number when no other information exists', () => {
        expect(utils.getChapterLabel(chapterWithOnlyVolume)).toEqual(
          'Volume 10',
        );
      });
    });

    describe('getChapterTitle', () => {
      it('returns the chapter title when it exists', () => {
        expect(utils.getChapterTitle(standardChapter)).toEqual('Title');
      });

      it('returns null for chapters without a chapter label', () => {
        // We return null here, since we use the chapter label as the title
        expect(utils.getChapterTitle(chapterWithoutNumber)).toEqual(null);
      });
    });
  });
});
