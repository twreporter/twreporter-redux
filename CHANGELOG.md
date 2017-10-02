### 2.2.0-beta.1.0.0
- Create Bookmark Feature

### 2.1.5
- Add gulpfile
- Update topics actions and reducers
- Update topics action and reducer tests

### 2.1.4
- Remove is_feature:true param in fetchPhotographyPostsOnIndexPage function

### 2.1.3
- Add isFetching in topics and topic reducers

### 2.1.2
- Fetch topics if topics exist but is empty object
- Fix indexpage to fit lint and test

### 2.1.1
- Add isFetching for GET_CONTENT_FOR_INDEX_PAGE

### 2.1.0
- Add process.env.API_HOST, process.env.API_PORT, process.env.API_PROTOCOL and process.env.API_DEFAULT_VERSION
variables for clients to overwrite the api config

### 2.0.1
- store slug in payload if action error occurs

### 2.0.0
- code refactoring, especially change the redux-state-fields data structure

### 1.0.7
- expose formatAPIURL function
- update fetchPhotographyPostsOnIndexPage function. Fetch featured posts.
- Update utils/form-api-url.js. Give toEncode param
