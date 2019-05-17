import { bindActionCreators } from 'redux'
import {
  fetchIndexPageContent,
  fetchCategoriesPostsOnIndexPage,
} from '../actions/index-page'
import {
  fetchAFullPost,
  fetchListedPosts,
  fetchEditorPickedPosts,
  fetchInfographicPostsOnIndexPage,
  fetchPhotographyPostsOnIndexPage,
} from '../actions/posts'
import {
  fetchAFullTopic,
  fetchTopics,
  fetchTopicsOnIndexPage,
} from '../actions/topics'

/**
 * A store enhancer that will attach a property `actions` consisting of action creators bound to store.
 * Ref. https://redux.js.org/glossary#store-enhancer
 *
 * @export
 * @param {Function} prevStoreCreator
 * @returns
 */
export default function bindActionsToStore(prevStoreCreator) {
  return function(reducer, preloadedState) {
    const _store = prevStoreCreator(reducer, preloadedState)
    _store.actions = bindActionCreators(
      {
        fetchIndexPageContent,
        fetchCategoriesPostsOnIndexPage,
        fetchAFullPost,
        fetchListedPosts,
        fetchEditorPickedPosts,
        fetchInfographicPostsOnIndexPage,
        fetchPhotographyPostsOnIndexPage,
        fetchAFullTopic,
        fetchTopics,
        fetchTopicsOnIndexPage,
      },
      _store.dispatch
    )
    return _store
  }
}
