import utils from './utils';

describe('utils', () => {
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
        expect(utils.getChapterLabel(standardChapter)).toEqual('Chapter 105');
      });

      it('returns the chapter title when no chapter number exists', () => {
        expect(utils.getChapterLabel(chapterWithoutNumber)).toEqual('Oneshot');
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
