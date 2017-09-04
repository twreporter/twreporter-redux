import apiConfig from '../conf/api-config.json'
import axios from 'axios'
import fieldNames from '../constants/redux-state-field-names'
import apiEndpoints from '../constants/api-endpoints'
import formAPIURL from '../utils/form-api-url'
import types from '../constants/action-types'
import pagination from '../utils/pagination'
import { NotFoundError } from '../utils/error'

// lodash
import get from 'lodash/get'
import isInteger from 'lodash/isInteger'

const _ = {
  get,
  isInteger,
}

const { pageToOffset } = pagination

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
      const meta = _.get(response, 'data.meta', {})
      const { total, offset, limit } = meta
      return dispatch({
        type: successActionType,
        payload: {
          items: _.get(response, 'data.records', []),
          total,
          limit,
          offset,
        },
      })
    })
    .catch((e) => {
      // Error to get topics
      return dispatch({
        type: types.ERROR_TO_GET_TOPICS,
        payload: {
          error: e,
        },
      })
    })
}

/* Fetch topics(only containing meta properties),
 * and it will load more if (total > items you have currently).
 * @param {number} limit - the number of posts you want to get in one request
 */
export function fetchTopics(page = 1, nPerPage = 5) {
  return (dispatch) => {
    /* If nPerPage number is invalid, return a Promise.reject(err) */
    if (!_.isInteger(nPerPage) || nPerPage <= 0) {
      const err = new NotFoundError(`nPerPage value must be an interger larger than 0, but is ${nPerPage}`)
      return Promise.reject(err)
    }
    /* If page number is invalid, , return a Promise.reject(err) */
    if (!_.isInteger(page) || page <= 0) {
      const err = new NotFoundError(`page value must be an interger larger than 0, but is ${page}`)
      return Promise.reject(err)
    }

    /* construct request path */
    const { limit, offset } = pageToOffset({ page, nPerPage })
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
