// import fieldNames from '../constants/redux-state-field-names'
import types from '../constants/action-types'

import get from 'lodash/get'
import concat from 'lodash/concat'

const _ = {
  get,
  concat,
}

const initialState = {
  error: {},
  data: [],
  total: 0,
  initialized: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.RECORD_BOOKMARK_ERROR: {
      return {
        ...state,
        error: action.payload.error,
      }
    }
    case types.GET_MULTIPLE_BOOKMARKS: {
      const latest_data = _.get(action, ['payload', 'data'], [])
      const current_data = _.get(state, 'data', 0)
      const total = _.get(action, ['payload', 'total'], 0)
      const res_data = _.concat(current_data, latest_data)
      return {
        ...state,
        data: res_data,
        total,
        initialized: true,
      }
    }
    case types.DELETE_SINGLE_BOOKMARK: {
      const current_data = _.get(state, ['data'], [])
      const current_total = _.get(state, ['total'], 0)
      const index = _.get(action, ['payload', 'index'], -1)
      if (index > -1) {
        current_data.splice(index, 1)
      }
      return {
        ...state,
        data: current_data,
        total: current_total === 0 ? 0 : current_total - 1,
      }
    }
    case types.CREATE_SINGLE_BOOKMARK: {
      const current_data = _.get(state, ['data'], [])
      current_data.unshift(_.get(action, ['payload', 'bookmark'], {}))
      return {
        ...state,
        data: current_data,
        total: _.get(state, ['total'], 0) + 1,
      }
    }
    default:
      return state
  }
}
