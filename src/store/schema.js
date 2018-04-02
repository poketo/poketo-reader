import { schema } from 'normalizr';

const chapter = new schema.Entity('chapters');
const series = new schema.Entity('series', {
  chapters: [chapter],
});
const collection = new schema.Entity(
  'collections',
  {},
  { idAttribute: 'slug' },
);

export default {
  chapter,
  series,
  collection,
};
