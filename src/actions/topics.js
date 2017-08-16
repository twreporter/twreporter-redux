import apiConfig from '../conf/api-config.json'
import axios from 'axios'
import fieldNames from '../constants/redux-state-field-names'
import apiEndpoints from '../constants/api-endpoints'
import formAPIURL from '../utils/form-api-url'
import types from '../constants/action-types'

// lodash
import get from 'lodash/get'

const _ = {
  get,
}


/* Fetch a full topic, whose assets like relateds, leading_video ...etc are all complete,
 * @param {string} slug - slug of topic
 */
export function fetchAFullTopic(slug) {
  return (dispatch, getState) => {
    const state = getState()
    const topic = _.get(state, `${fieldNames.entities}.${fieldNames.topicsInEntities}.${slug}`, {})
    if (_.get(topic, 'full', false)) {
      return dispatch({
        type: types.CHANGE_SELECTED_TOPIC,
        payload: topic,
      })
    }

    const path = `${apiEndpoints.topics}/${slug}?full=true`

    // Start to get topics
    dispatch({
      type: types.START_TO_GET_A_FULL_TOPIC,
      payload: {
        slug,
      },
    })

    return axios.get(formAPIURL(path), {
      timeout: apiConfig.API_TIME_OUT,
    })
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
          payload: {
            error,
            slug,
          },
        })
      })
  }
}

function _fetchTopics(dispatch, path, successActionType) {
  // Start to get topics
  const url = formAPIURL(path)
  dispatch({
    type: types.START_TO_GET_TOPICS,
    url,
  })

  return axios.get(url, {
    timeout: apiConfig.API_TIME_OUT,
  })
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
        error,
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
    const topics = _.get(state, fieldNames.topicList)
    const items = _.get(topics, 'items')

    // if items already exsited and there is nothing more to load
    if (Array.isArray(items) && _.get(topics, 'total', 0) <= items.length) {
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
    const topics = _.get(state, `${fieldNames.indexPage}.${fieldNames.sections.topicsSection}`, [])
    if (Array.isArray(topics) && topics.length > 0) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.topics}?offset=1&limit=4`

    return _fetchTopics(dispatch, path, types.GET_TOPICS_FOR_INDEX_PAGE)
  }
}
