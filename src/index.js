import { fetchIndexPageContent } from './actions/index-page'
import { fetchAFullPost, fetchListedPosts, fetchEditorPickedPosts,
  fetchInfographicPostsOnIndexPage, fetchPhotographyPostsOnIndexPage } from './actions/posts'
import { fetchAFullTopic, fetchTopics, fetchTopicsOnIndexPage } from './actions/topics'
import entities from './reducers/entities'
import posts from './reducers/posts'
import topics from './reducers/topics'
import indexPage from './reducers/index-page'

export default {
  actions: {
    fetchEditorPickedPosts,
    fetchTopics,
    fetchAFullPost,
    fetchAFullTopic,
    fetchListedPosts,
    fetchIndexPageContent,
    fetchTopicsOnIndexPage,
    fetchInfographicPostsOnIndexPage,
    fetchPhotographyPostsOnIndexPage,
  },
  reducers: {
    entities,
    posts,
    topics,
    indexPage,
  },
}
