# poketo-service

A microservice for scraping manga sites. Also includes endpoints to store minimal data about collections, as a stop-gap for cross-browser syncing without accounts. Used in the [Poketo manga reader](https://poketo.app).

## Usage

Most Poketo endpoints are direct calls to the [poketo library](https://github.com/poketo/lib).

### Getting series info

To load data about a series, send a request to `/series`. You can specify the series [by URL](#passing-urls).

```html
<script>
  fetch('https://api.poketo.app/series?url=http://merakiscans.com/senryu-girl')
    .then(response => response.json())
    .then(series => console.log(series.title, series.chapters))
</script>
```

See the response format here: [https://api.poketo.app/series?url=http://merakiscans.com/senryu-girl](https://api.poketo.app/series?url=http://merakiscans.com/senryu-girl)

### Getting chapter info

If you want to read the pages of an individual chapter, send a request to `/chapter`. Like the series endpoint, you can specify the chapter [by URL](#passing-urls).

```html
<script>
  fetch('https://api.poketo.app/chapter?url=http://merakiscans.com/senryu-girl/5')
    .then(response => response.json())
    .then(chapter => console.log(chapter.chapterNumber, chapter.pages))
</script>
```

See the response format here: [https://api.poketo.app/chapter?url=http://merakiscans.com/senryu-girl/5](https://api.poketo.app/chapter?url=http://merakiscans.com/senryu-girl/5)

### Passing URLs

Poketo scrapes sites, so it works by passing in URLs. For a list of supported sites, check out [the Node library docs](https://github.com/poketo/node).

To read a series, you'll need to pass the URL for a chapter index page. Chapter indexes have a listing of all the chapters in a series, and often have details about the series itself. Here are some examples for various sites:

- [Mangadex](https://mangadex.org/manga/15653/dragon-ball-super), `https://mangadex.org/manga/15653`
- [Manga Stream](https://readms.net/manga/attack_on_titan), `https://readms.net/manga/attack_on_titan`
- [Jaimini's Box](https://jaiminisbox.com/reader/series/my-hero-academia), `https://jaiminisbox.com/reader/series/my-hero-academia`

To read a chapter, pass the page for that specific chapter. To continue the examples above:

- [Mangadex](https://mangadex.org/chapter/261311/1), `https://mangadex.org/chapter/261311/1`
- [Manga Stream](https://readms.net/r/attack_on_titan/105/5057/1), `https://readms.net/r/attack_on_titan/105/5057/1`
- [Jaimini's Box](https://jaiminisbox.com/reader/read/my-hero-academia/en/0/150/page/1), `https://jaiminisbox.com/reader/read/my-hero-academia/en/0/150/page/1`

It should be relatively obvious site-to-site which page URLs you'll want to pass in. Plus, most Poketo API responses have URLs included in case you want to reference a chapter after fetching the series details.

### Collection actions

Detailed docs for this section are pending. These are primarily used by the [Poketo reader](https://poketo.app).

#### Getting series in a collection

Coming soon...

#### Adding and removing bookmarks

To add a new bookmark

```
POST https://api.poketo.app/collection/:slug/bookmark/new
```

To remove a bookmark

```
DELETE https://api.poketo.app/collection/:slug/bookmark/:seriesId/read
```

#### Marking chapters as read

```
POST https://api.poketo.app/collection/:slug/bookmark/:seriesId/read
```

Looks for a `lastReadChapterId` field in the JSON body.

## Miscellaneous

### Motivation

It's nice when browsers can handle everything on their own. The fewer servers behind the web, the better. Unfortunately, browsers can't easily:

- Scrape sites on other domains
- Sync data across devices
- Persist data on devices over long periods of time

This service fills those gaps:

- Uses Node to scrape scanlator or aggregator sites for series info and chapter images
- Stores manga collections on a server for permanence and cross-device browsing (but captures as little data as possible ie. no email, no accounts)

### Colophon

The live version at [api.poketo.app](https://api.poketo.app) is deployed on [Now](https://now.sh) and collection data is hosted on a MongoDB database from [mLab](https://mlab.com). Feel free to clone and run your own instance with the same setup!

### License

MIT
