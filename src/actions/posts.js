import apiConfig from '../conf/api-config.json'
import apiEndpoints from '../constants/api-endpoints'
import axios from 'axios'
import fieldNames from '../constants/redux-state-field-names'
import formAPIURL from '../utils/form-api-url'
import postStyles from '../constants/post-styles'
import types from '../constants/action-types'

// lodash
import get from 'lodash/get'
import merge from 'lodash/merge'

const _ = {
  get,
  merge,
}

/* Fetch a full post, whose assets like relateds, leading_video ...etc are all complete,
 * @param {string} slug - slug of post
 */
export function fetchAFullPost(slug) {
  return (dispatch, getState) => {
    const state = getState()
    const post = _.get(state, `${fieldNames.entities}.${fieldNames.postsInEntities}.${slug}`, {})
    if (_.get(post, 'full', false)) {
      return dispatch({
        type: types.CHANGE_SELECTED_POST,
        payload: post,
      })
    }

    const path = `${apiEndpoints.posts}/${slug}?full=true`

    const url = formAPIURL(path)
    // Start to get topics
    dispatch({
      type: types.START_TO_GET_A_FULL_POST,
      payload: {
        slug,
      },
    })

    return axios.get(url, {
      timeout: apiConfig.API_TIME_OUT,
    })
      .then((response) => {
        return dispatch({
          type: types.GET_A_FULL_POST,
          payload: _.get(response, 'data.record', {}),
        })
      })
      .catch((error) => {
        // Error to get topics
        return dispatch({
          type: types.ERROR_TO_GET_A_FULL_POST,
          error,
        })
      })
  }
}

/*
 * @param {function} dispatch - dispatch of redux
 * @param {string} path - uri
 * @param {string} successActionType - action type
 * @param {string} failureActionType - action type
 * @param {object} defaultPayload
 */
function _fetchPosts(dispatch, path, successActionType, failureActionType = types.ERROR_TO_GET_POSTS, defaultPayload = {}) {
  const url = formAPIURL(path)
  dispatch({
    type: types.START_TO_GET_POSTS,
    url,
  })

  return axios.get(url, {
    timeout: apiConfig.API_TIME_OUT,
  })
    .then((response) => {
      return dispatch({
        type: successActionType,
        payload: _.merge({
          items: _.get(response, 'data.records', []),
          total: _.get(response, 'data.meta.total', 0),
        }, defaultPayload),
      })
    })
    .catch((error) => {
      // Error to get topics
      return dispatch(_.merge({
        type: failureActionType,
        error,
      }, defaultPayload))
    })
}

/* Fetch a listed posts(only containing meta properties),
 * such as the posts belonging to the same tag/category/topic.
 * @param {string} listID - id of the tag, category or topic
 * @param {string} listType - tags, categories or topics
 * @param {number} limit - the number of posts you want to get in one request
 */
export function fetchListedPosts(listID, listType, limit = 10) {
  return (dispatch, getState) => {
    const state = getState()
    const list = _.get(state, [fieldNames.lists, listID])

    // if list is already existed and there is nothing more to load
    if (list && _.get(list, 'total', 0) <= _.get(list, 'items.length', 0)) {
      return Promise.resolve()
    }

    const where = {
      [listType]: {
        in: [listID],
      },
    }

    const offset = _.get(list, 'items.length', 0)
    const path = `${apiEndpoints.posts}?where=${JSON.stringify(where)}&limit=${limit}&offset=${offset}`

    return _fetchPosts(dispatch, path, types.GET_LISTED_POSTS, types.ERROR_TO_GET_LISTED_POSTS, { listID })
  }
}

/** Fetch those posts picked by editors
 */
export function fetchEditorPickedPosts() {
  return (dispatch, getState) => {
    const state = getState()
    const posts = _.get(state, `${fieldNames.indexPage}.${fieldNames.sections.editorPicksSection}`, [])

    if (posts.length > 0) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.posts}?where={"is_featured":true}&limit=6`

    return _fetchPosts(dispatch, path, types.GET_EDITOR_PICKED_POSTS)
  }
}

/**
 * fetchPhotographyPostsOnIndexPage
 * This function will fetch 6 latest posts with photography style and `is_featured: true`,
 * It's specifically made for index page
 */
export function fetchPhotographyPostsOnIndexPage() {
  return (dispatch, getState) => {
    const state = getState()
    const posts = _.get(state, `${fieldNames.indexPage}.${fieldNames.sections.photosSection}`, [])
    if (Array.isArray(posts) && posts.length > 0) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.posts}?where={"style":"${postStyles.photography}","is_featured":true}&limit=6`

    return _fetchPosts(dispatch, path, types.GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE)
  }
}

/**
 * fetchInfographicPostsOnIndexPage
 * This function will fetch 10 latest posts with interactive style,
 * It's specifically made for index page
 */
export function fetchInfographicPostsOnIndexPage() {
  return (dispatch, getState) => {
    const state = getState()
    const posts = _.get(state, `${fieldNames.indexPage}.${fieldNames.sections.infographicsSection}`, [])
    if (Array.isArray(posts) && posts.length > 0) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.posts}?where={"style":"${postStyles.infographic}"}&limit=10`

    return _fetchPosts(dispatch, path, types.GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE)
  }
}
