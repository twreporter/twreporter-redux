
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

function _fetch(dispatch, path) {
  const url = formAPIURL(path)

  // Start to get content
  dispatch({
    type: types.START_TO_GET_INDEX_PAGE_CONTENT,
    url,
  })

  return axios.get(url)
  // Get content successfully
    .then((response) => {
      const items = _.get(response, 'data.records', {})

      // dispatch content for each sections
      return dispatch({
        type: types.GET_CONTENT_FOR_INDEX_PAGE,
        payload: items,
      })
    })
    .catch((error) => {
      // Error to get topics
      return dispatch({
        type: types.ERROR_TO_GET_INDEX_PAGE_CONTENT,
        error,
      })
    })
}

/**
 * fetchIndexPageContent
 * This function will fetch the top fourth sections on the index page,
 * including latest, editor_picks, latest_topic and reviews
 */
export function fetchIndexPageContent() {
  return (dispatch, getState) => {
    const state = getState()
    const indexPage = _.get(state, fieldNames.indexPage, {})
    const fields = [fieldNames.latest, fieldNames.editorPicks, fieldNames.latestTopic, fieldNames.reviews, fieldNames.topics, fieldNames.photos, fieldNames.infographics]
    let isContentReady = true

    fields.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(indexPage, field)) {
        isContentReady = false
      }
    })
    if (isContentReady) {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.indexPage}`

    return _fetch(dispatch, path)
  }
}

/**
 * fetchCategoriesPostsOnIndexPage
 * This function will fetch all the posts of each category, total 8 categories, for category section on the index page.
 */
export function fetchCategoriesPostsOnIndexPage() {
  return (dispatch, getState) => {
    const state = getState()
    const categorySection = _.get(state, [fieldNames.indexPage, fieldNames.category], {})

    if (typeof categorySection === 'object') {
      return Promise.resolve()
    }

    const path = `${apiEndpoints.indexPageCategories}`

    return _fetch(dispatch, path)
  }
}
