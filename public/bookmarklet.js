(function() {
  var apiBaseUrl = 'https://api.poketo.app';
  var readerBaseUrl = 'https://poketo.app/read';

  getChapter(window.location.href).then(
    function(response) {
      window.location = readerBaseUrl + '/' + response.id;
    },
    function(err) {
      switch (err.code) {
        case 'UNSUPPORTED_SITE':
          alert(
            'Sorry, "' + window.location.host + '" is not a supported site.',
          );
          break;
        case 'INVALID_URL':
          alert(
            'This is not a chapter page. Find a chapter you’d like to read and use this bookmarklet from that page.',
          );
          break;
        case 'SERVER_ERROR':
          if (err.message.includes('not read chapter slug')) {
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
    },
  );

  function getChapter(url) {
    return get(apiBaseUrl + '/chapter?url=' + encodeURIComponent(url));
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
