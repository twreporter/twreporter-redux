import { denormalizePosts, denormalizeTopics } from './utils/denormalize-asset'
import { post, posts } from './reducers/posts'
import { topic, topics } from './reducers/topics'
import actions from './actions'
import createStore from './store/create-store'
import entities from './reducers/entities'
import formAPIURL from './utils/form-api-url'
import indexPage from './reducers/index-page'
import pagination from './utils/pagination'
import reduxStateFields from './constants/redux-state-field-names'
import ReduxStoreContext from './context/redux-store'
import ReduxStoreProvider from './component/provider'

export default {
  createStore,
  ReduxStoreProvider,
  ReduxStoreContext,
  actions,
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
