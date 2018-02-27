const hibiscss = require('hibiscss').default;
const kit = require('hibiscss/default');

const styles = hibiscss(
  kit({
    borderRadius: {
      '4': '4px',
      round: '50%',
      pill: '9999px',
    },
    colors: {
      white: 'white',
      pink: '#ff8b8b',
      black: '#141414',
      fadedBlack: 'rgba(12, 12, 12, 0.35)',
    },
    sizes: {
      '8': '8px',
      '12': '12px',
      '16': '16px',
    },
    maxWidths: {
      500: '500px',
    },
  }),
  {
    m: '768px',
  },
);

console.log(styles);
