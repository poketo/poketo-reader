(function() {
  var apiBaseUrl = 'https://api.poketo.app';
  var readerBaseUrl = 'https://poketo.app/read';

  var targetUrl = window.location.href;

  getChapter(targetUrl)
    .then(function(response) {
      redirect(response.id);
    })
    .catch(function() {
      return getSeries(targetUrl)
        .then(function(response) {
          redirect(response.chapters[0].id);
        })
        .catch(handleError);
    });

  function handleError(err) {
    switch (err.code) {
      case 'UNSUPPORTED_SITE':
        alert('Sorry, "' + window.location.host + '" is not a supported site.');
        break;
      case 'INVALID_URL':
        alert(
          'This is not a chapter page. Find a chapter you’d like to read and use this bookmarklet from that page.',
        );
        break;
      case 'SERVER_ERROR':
        if (err.message.indexOf('not read chapter slug') !== -1) {
          alert(
            'This is not a chapter page. Find a chapter you’d like to read and use this bookmarklet from that page.',
          );
        } else {
          alert('Something went wrong: ' + err.message);
        }
        break;
      default:
        alert('Something went wrong: ' + err.message);
        break;
    }
  }

  function redirect(id) {
    window.location =
      readerBaseUrl + '/' + encodeURIComponent(id).replace(/%3A/g, ':');
  }

  function getChapter(url) {
    return get(apiBaseUrl + '/chapter?url=' + encodeURIComponent(url));
  }

  function getSeries(url) {
    return get(apiBaseUrl + '/series?url=' + encodeURIComponent(url));
  }

  function get(url) {
    return fetch(url).then(function(response) {
      if (!response.ok) {
        return response.json().then(body => {
          var err = new Error(body.message);
          err.code = body.code;
          err.statusCode = response.status;
          throw err;
        });
      }

      return response.json();
    });
  }
})();
