
import axios from 'axios'
// lodash
import get from 'lodash/get'
import types from '../constants/action-types'
import fieldNames from '../constants/redux-state-fields'
import apiEndpoints from '../constants/api-endpoints'
import formAPIURL from '../utils/form-api-url'

const _ = {
  get,
}


/* Fetch a full topic, whose assets like relateds, leading_video ...etc are all complete,
 * @param {string} slug - slug of topic
 */
export function fetchAFullTopic(slug) {
  return (dispatch, getState) => {
    const state = getState()
    const topic = _.get(state, `${fieldNames.entities}.${fieldNames.topics}.${slug}`, {})
    if (_.get(topic, 'full', false)) {
      return Promise.resolve()
    }

    const url = `${apiEndpoints.topics}/${slug}?full=true`

    // Start to get topics
    dispatch({
      type: types.START_TO_GET_A_FULL_TOPIC,
      url,
    })

    return axios.get(formAPIURL(url))
      .then((response) => {
        return dispatch({
          type: types.GET_A_FULL_TOPIC,
          payload: _.get(response, 'data.record', {}),
        })
      })
      .catch((error) => {
        // Error to get topics
        return dispatch({
          type: types.ERROR_TO_GET_A_FULL_TOPIC,
          error: error,
        })
      })
  }
}

function _fetchTopics(dispatch, url, successActionType) {
  // Start to get topics
  dispatch({
    type: types.START_TO_GET_TOPICS,
  })

  return axios.get(formAPIURL(url))
    .then((response) => {
      return dispatch({
        type: successActionType,
        payload: {
          items: _.get(response, 'data.records', []),
          total: _.get(response, 'data.meta.total', 0),
        },
      })
    })
    .catch((error) => {
      // Error to get topics
      return dispatch({
        type: types.ERROR_TO_GET_TOPICS,
        error: error,
      })
    })
}

/* Fetch topics(only containing meta properties),
 * and it will load more if (total > items you have currently).
 * @param {number} limit - the number of posts you want to get in one request
 */
export function fetchTopics(limit) {
  return (dispatch, getState) => {
    const state = getState()
    const topics = _.get(state, fieldNames.topics)

    // if topics already exsited and there is nothing more to load
    if (topics && _.get(topics, 'total', 0) <= _.get(topics, 'items.length', 0)) {
      return Promise.resolve()
    }

    const offset = _.get(topics, 'items.length', 0)
    const path = `${apiEndpoints.topics}?limit=${limit}&offset=${offset}`

    return _fetchTopics(dispatch, path, types.GET_TOPICS)
  }
}

/**
 * fetchTopicsOnIndexPage
 * This function will fetch the 2 to 5 latest topics.
 * It's specifically made for index page
 */
export function fetchTopicsOnIndexPage() {
  return (dispatch, getState) => {
    const state = getState()
    const topics = _.get(state, `${fieldNames.indexPage}.${fieldNames.topics}`, [])
    if (Array.isArray(topics) && topics.length > 0) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.topics}?offset=1&limit=4`

    return _fetchTopics(dispatch, path, types.GET_TOPICS_FOR_INDEX_PAGE)
  }
}
