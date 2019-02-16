exports.seed = knex => {
  // Deletes ALL existing entries
  return knex('bookmarks')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('bookmarks').insert([
        {
          id: '78dbb55b-a3a1-4431-a5d0-5cf2b9829d9f',
          ownerId: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
          seriesId: 'mangadex:7645',
          seriesUrl: 'https://mangadex.org/title/7645',
          lastReadChapterId: null,
          lastReadAt: null,
          linkToUrl: null,
        },
        {
          id: '3c407aee-c119-46ba-9454-8a9dc5546afc',
          ownerId: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
          seriesId: 'mangadex:22482',
          seriesUrl: 'https://mangadex.org/title/22482',
          lastReadChapterId: 'mangadex:22482:533655',
          lastReadAt: null,
          linkToUrl: null,
        },
        {
          id: '0cd12169-7d4d-45f0-8644-dd33f1d80322',
          ownerId: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
          seriesId: 'helvetica-scans:talentless-nana',
          seriesUrl: 'https://helveticascans.com/r/series/talentless-nana',
          lastReadChapterId: 'helvetica-scans:talentless-nana:en%2F3%2F18',
          lastReadAt: null,
          linkToUrl: null,
        },
        {
          id: '1de53313-8d9f-439c-b86c-aa1d0691ec85',
          ownerId: '12e63540-9a2e-4a39-9560-87fc82ea1c6c',
          seriesId: 'mangadex:15553',
          seriesUrl: 'https://mangadex.org/title/22482',
          lastReadChapterId: null,
          lastReadAt: null,
          linkToUrl: null,
        },
      ]);
    });
};
