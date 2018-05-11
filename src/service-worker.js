// @flow

import { invariant } from './utils';

type Config = {
  onUpdate?: (registration: ServiceWorkerRegistration) => void,
  onSuccess?: (registration: ServiceWorkerRegistration) => void,
};

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
);

function register(config: Config = {}) {
  if (process.env.NODE_ENV !== 'production' || !navigator.serviceWorker) {
    return;
  }

  invariant(
    typeof process.env.PUBLIC_URL === 'string',
    'Must provide the PUBLIC_URL environment variable',
  );

  const url = new URL(process.env.PUBLIC_URL, window.location);
  const serviceWorkerUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

  if (url.origin !== window.location.origin) {
    // Service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebook/create-react-app/issues/2374
    return;
  }

  window.addEventListener('load', () => {
    if (isLocalhost) {
      checkValidServiceWorker(serviceWorkerUrl, config);
    } else {
      registerValidSW(serviceWorkerUrl, config);
    }
  });
}

function registerValidSW(url, config) {
  invariant(navigator.serviceWorker);
  navigator.serviceWorker
    .register(url)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          invariant(navigator.serviceWorker, 'Service Worker is not defined');

          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              // console.log('New content is available; please refresh.');

              // Execute callback
              if (config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              // console.log('Content is cached for offline use.');

              // Execute callback
              if (config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        invariant(navigator.serviceWorker, 'Service Worker is not defined');

        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // No internet, app is offline
    });
}

function unregister() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

export default { register, unregister };
