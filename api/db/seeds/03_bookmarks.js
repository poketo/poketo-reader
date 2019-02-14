exports.seed = knex => {
  // Deletes ALL existing entries
  return knex('bookmarks')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('bookmarks').insert([
        {
          id: '78dbb55b-a3a1-4431-a5d0-5cf2b9829d9f',
          collection: '5e8ac124-128a-46c4-a592-49ad03fd2b93',
          series_pid: 'mangadex:7645',
          series_url: 'https://mangadex.org/title/7645',
          last_read_chapter_pid: null,
          link_to_url: null,
        },
        {
          id: '3c407aee-c119-46ba-9454-8a9dc5546afc',
          collection: '5e8ac124-128a-46c4-a592-49ad03fd2b93',
          series_pid: 'mangadex:22482',
          series_url: 'https://mangadex.org/title/22482',
          last_read_chapter_pid: 'mangadex:22482:533655',
          link_to_url: null,
        },
        {
          id: '0cd12169-7d4d-45f0-8644-dd33f1d80322',
          collection: '5e8ac124-128a-46c4-a592-49ad03fd2b93',
          series_pid: 'helvetica-scans:talentless-nana',
          series_url: 'https://helveticascans.com/r/series/talentless-nana',
          last_read_chapter_pid: 'helvetica-scans:talentless-nana:en%2F3%2F18',
          link_to_url: null,
        },
        {
          id: '1de53313-8d9f-439c-b86c-aa1d0691ec85',
          collection: '5e8ac124-128a-46c4-a592-49ad03fd2b93',
          series_pid: 'mangadex:15553',
          series_url: 'https://mangadex.org/title/22482',
          last_read_chapter_pid: '',
          link_to_url: null,
        },
      ]);
    });
};
