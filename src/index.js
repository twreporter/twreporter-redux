import entities from './reducers/entities'
import formAPIURL from './utils/form-api-url'
import createStore from './store/create-store'
import indexPage from './reducers/index-page'
import pagination from './utils/pagination'
import reduxStateFields from './constants/redux-state-field-names'
import ReduxStoreContext from './context/redux-store'
import ReduxStoreProvider from './component/provider'
import { denormalizePosts, denormalizeTopics } from './utils/denormalize-asset'
import { post, posts } from './reducers/posts'
import { topic, topics } from './reducers/topics'
import {
  fetchIndexPageContent,
  fetchCategoriesPostsOnIndexPage,
} from './actions/index-page'
import {
  fetchAFullPost,
  fetchListedPosts,
  fetchEditorPickedPosts,
  fetchInfographicPostsOnIndexPage,
  fetchPhotographyPostsOnIndexPage,
} from './actions/posts'
import {
  fetchAFullTopic,
  fetchTopics,
  fetchTopicsOnIndexPage,
} from './actions/topics'

export default {
  createStore,
  ReduxStoreProvider,
  ReduxStoreContext,
  actions: {
    fetchEditorPickedPosts,
    fetchCategoriesPostsOnIndexPage,
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
    post,
    posts,
    topic,
    topics,
    indexPage,
  },
  reduxStateFields,
  utils: {
    denormalizePosts,
    denormalizeTopics,
    formAPIURL,
    pagination,
  },
}
