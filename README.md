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

## state
The redux state will be like the following example.

If you use this library,
please make sure the field name of your redux state should match the [field name we define](https://github.com/nickhsine/twreporter-redux/blob/master/src/constants/redux-state-field-names.js).
```
{
  index_page: {
    latest_section: [],
    editor_picks_section: [],
    latest_topic_section: [],
    reviews_section: [],
    opics_section: [],
    photos_section: [],
    infographics_section: [],
  },
  // full topics and posts will be stored here
  entities: {
    posts: {},
    topics: {},
  },
  lists: {
    // list might be any group of posts
    listID1: {
      total: 10,
      // there will be only slugs in items
      items: ['slug-1', 'slug-2', 'slug-4'],
      error: null,
      
      // pages is used to store items position,
      // say, if
      // pages = {
      //  1: [0, 2]
      // }
      // which means, items of page 1 are stored
      // from items[0] to items[2]
      pages: {
        1: [0, 3],
      }
    },
    listID2: {
      total: 15,
      // there will be only slugs in items
      items: [],
      error: null,
      pages: {},
    }
  },
  // list topics we already get
  topic_list: {
    total: 10,
    // only store topic slug
    items: [],
    totalPages: 1,
    
    // current page
    page: 1,
    
    // number per page
    nPerPage: 10,
    error: null,
    isFetching: false,  
  },
  // current post we want to show in article page
  selected_post: {
    isFetching: true,
    slug: 'post-slug',
    error: null
  },
  // current topic we want to show in topic landing page
  selected_topic: {
    isFetching: true,
    slug: 'topic-slug',
    error: null
  }
```

## actions
### index-page 
Fetch all posts and topics [index page](https://www.twreporter.org) needed.

### posts
* Fetch a full post, which will include details, other than metadata, like what topic it belongs to, 
or what other posts it is releated to.
* Fetch a list of posts, which will only include the metadata(like slug, title, description, published data ...etc) of posts. 

### topics
* Fetch a full topic, which will include all the posts belonging to it.
* Fetch a list of topics, which will only include the metadata(like slug, title, description, published data ...etc) of topics.

## reducers
### index-page
`reduxState.indexPage` will contain each sections(like editor_picks, review, latest ...etc) in the [homepage of twreporter](https://www.twreporter.org)

### posts
`reduxState.post` will store `slug`, `error` and `isFetching`

`reduxState.posts` will store `items`, `error`and `total`

### topics
`reduxState.topic` will store `slug`, `error` and `isFetching`

`reduxState.topics` will store `items`, `totalPages`, `page`, `nPerPage`, `error` and `isFetching`

### entities
`reduxState.entities.posts` will store ${POST_SLUG}: ${POST_DATA} (string: Object) pair in a map

`reduxState.entities.topics` will store ${TOPIC_SLUG}: ${TOPIC_DATA} {string: Object} pair in a map

