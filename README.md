[![Tag](https://img.shields.io/github/tag/twreporter/twreporter-redux.svg)](https://github.com/twreporter/twreporter-redux/tags)
[![NPM version](https://img.shields.io/npm/v/@twreporter/redux.svg)](https://www.npmjs.com/package/@twreporter/redux)

# twreporter-redux
Redux actions and reducers for [twreporter website](https://www.twreporter.org).

## Development
```
CUSTOMER_FOLDER=../entry_project/ npm run dev

// Assume your entry project is located at /home/nickli/entry_project.
// In the entry_project, you install @twreporter/redux, 
// all the @twreporter/redux codes will be at /home/nickli/entry_project/@twreporter/redux.
// npm run dev will copy @twreporter/redux transpiled es5 javascript codes to your custom folder, that is entry_project. 
```

## Build
`npm run build`

## Publish
`npm publish`

### actions
#### index-page 
Fetch all posts and topics [index page](https://www.twreporter.org) needed.

#### posts
* Fetch a full post, which will include details, other than metadata, like what topic it belongs to, 
or what other posts it is releated to.
* Fetch a list of posts, which will only include the metadata(like slug, title, description, published data ...etc) of posts. 

#### topics
* Fetch a full topic, which will include all the posts belonging to it.
* Fetch a list of topics, which will only include the metadata(like slug, title, description, published data ...etc) of topics.

### reducers
#### index-page
reduxState.indexPage will contain each sections(like editor_picks, review, latest ...etc) in the [homepage of twreporter](https://www.twreporter.org)

#### posts
reduxState.post will store `slug`, `error` and `isFetching`
reduxState.posts will store `items`, `error`and `total`

#### topics
reduxState.topic will store `slug`, `error` and `isFetching`
reduxState.topics will store `items`, `totalPages`, `page`, `nPerPage`, `error` and `isFetching`

#### entities
reduxState.entities.posts will store ${POST_SLUG}: ${POST_DATA} (string: Object) pair in a map
reduxState.entities.topics will store ${TOPIC_SLUG}: ${TOPIC_DATA} {string: Object} pair in a map

