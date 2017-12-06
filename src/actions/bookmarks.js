import DateStringToTimeStamp from '../utils/date-string-to-timestamp'
import apiConfig from '../conf/api-config.json'
import apiEndpoints from '../constants/api-endpoints'
import axios from 'axios'
import findIndex from 'lodash/findIndex'
import formAPIURL from '../utils/form-api-url'
// lodash
import get from 'lodash/get'
import { getNecessaryInfo } from '../utils/local-storage-manager'
import types from '../constants/action-types'

const _ = {
  get,
  findIndex,
}

const getAxiosInstance = (token) => {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

const errorHandler = (error) => {
  return {
    type: types.RECORD_BOOKMARK_ERROR,
    payload: {
      error,
    },
  }
}

const deleteSingleBookmarkSuc = (target_index) => {
  return {
    type: types.DELETE_SINGLE_BOOKMARK,
    payload: {
      index: target_index,
    },
  }
}

const getMultipleBookmarksSuc = (offset, data, total) => {
  return {
    type: types.GET_MULTIPLE_BOOKMARKS,
    payload: {
      offset,
      data,
      total,
    },
  }
}

const createSingleBookmarkSuc = (bookmark) => {
  return {
    type: types.CREATE_SINGLE_BOOKMARK,
    payload: {
      bookmark,
    },
  }
}

export function createBookmark({ slug, host, is_external, title, desc, thumbnail, category, published_date }) {
  return (dispatch) => {
    const { token, userId } = getNecessaryInfo()
    const axiosInstance = getAxiosInstance(token)
    const path = `${apiEndpoints.users}/${userId}/${apiEndpoints.bookmarks}`
    const url = formAPIURL(path)
    const bookmark = {
      slug,
      host,
      is_external,
      title,
      desc,
      thumbnail,
      category,
      published_date: DateStringToTimeStamp(published_date),
    }
    return axiosInstance.post(url, bookmark)
      .then((res) => {
        const id = _.get(res, 'data.record.id', 0)
        dispatch(createSingleBookmarkSuc({ ...bookmark, id }))
        return id
      })
      .catch((error) => {
        dispatch(errorHandler(error))
        throw error
      })
  }
}

export function getBookmarks(offset, limit, sort) {
  return (dispatch) => {
    const { token, userId } = getNecessaryInfo()
    const axiosInstance = getAxiosInstance(token)
    const path = `${apiEndpoints.users}/${userId}/${apiEndpoints.bookmarks}?offset=${offset}&limit=${limit}&sort=${sort}`
    const url = formAPIURL(path)
    return axiosInstance.get(url)
      .then((res) => {
        const data = _.get(res, 'data.records', [])
        const total = _.get(res, 'data.meta.total', 0)
        if (data && total) {
          dispatch(getMultipleBookmarksSuc(offset, data, total))
        }
        return { data, total }
      })
      .catch((error) => {
        dispatch(errorHandler(error))
        throw error
      })
  }
}

export function getCurrentBookmark(bookmarkSlug, host) {
  return (dispatch) => {
    const { token, userId } = getNecessaryInfo()
    const axiosInstance = getAxiosInstance(token)
    const path = `${apiEndpoints.users}/${userId}/${apiEndpoints.bookmarks}/${bookmarkSlug}?host=${host}`
    const url = formAPIURL(path)
    return axiosInstance.get(url)
      .then((res) => {
        return _.get(res, 'data.record.id', 0)
      })
      .catch((error) => {
        dispatch(errorHandler(error))
        throw error
      })
  }
}

export function deleteBookmark(bookmarkID) {
  return (dispatch, getState) => {
    const state = getState()
    const data = _.get(state, ['bookmarks', 'data'], [])
    const target_index = _.findIndex(data, (obj) => {
      return obj.id === bookmarkID
    })
    const { token, userId } = getNecessaryInfo()
    const axiosInstance = getAxiosInstance(token)
    const path = `${apiEndpoints.users}/${userId}/${apiEndpoints.bookmarks}/${bookmarkID}`
    const url = formAPIURL(path)
    return axiosInstance.delete(url, {
      timeout: apiConfig.API_TIME_OUT,
    })
      .then(() => {
        dispatch(deleteSingleBookmarkSuc(target_index))
      })
      .catch((error) => {
        dispatch(errorHandler(error))
        throw error
      })
  }
}
