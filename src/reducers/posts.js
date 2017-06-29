import types from '../constants/action-types'

// lodash
import concat from 'lodash/concat'
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'
import set from 'lodash/set'

const _ = {
  concat,
  get,
  map,
  merge,
  set,
}

function posts(state = {}, action = {}) {
  switch (action.type) {
    case types.GET_A_FULL_POST: {
      return _.get(action, 'payload.slug')
    }

    case types.GET_LISTED_POSTS: {
      const items = _.get(action, 'payload.items', [])
      const total = _.get(action, 'payload.total', 0)
      const listID = _.get(action, 'payload.listID', '')
      const list = _.get(state, listID, {
        items: [],
        total: 0,
      })

      list.items = _.concat(list.items, _.map(items, item => item.slug))
      list.total = total

      return _.merge({}, state, {
        [listID]: list,
      })
    }

    case types.START_TO_GET_A_FULL_POST:
    case types.START_TO_GET_POSTS:
      console.log('url to fetch:', action.url)
      return state

    case types.ERROR_TO_GET_A_FULL_POST:
    case types.ERROR_TO_GET_POSTS:
      console.warn(`${action.type} : ${action.errorMsg.toString()}`)
      return state
    default:
      return state
  }
}

export default posts
