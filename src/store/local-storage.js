// @flow

const hasLocalStorage = (() => {
  try {
    if (!window.localStorage) {
      return false;
    }

    window.localStorage.setItem('Storage-Test', '1');
    if (window.localStorage.getItem('Storage-Test') !== '1') {
      return false;
    }
    window.localStorage.removeItem('Storage-Test');
  } catch (err) {
    return false;
  }

  return true;
})();

const storage = hasLocalStorage
  ? window.localStorage
  : {
      getItem: (key: string) => null,
      setItem: (key: string, value: mixed) => undefined,
      removeItem: (key: string) => undefined,
    };

export default storage;
