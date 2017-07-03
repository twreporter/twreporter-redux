import types from '../constants/action-types'
import fieldNames from '../constants/redux-state-fields'
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'

const _ = {
  get,
  map,
  merge,
}

const { latest, latestTopic, editorPicks, reviews, topics, photos,
  infographics, humanRights, landEnvironment, politicalSociety,
  cultureMovie, photoAudio, international, character,
  transformedJustice } = fieldNames

function indexPage(state = {}, action = {}) {
  let payload
  switch (action.type) {
    case types.GET_CONTENT_FOR_INDEX_PAGE: {
      payload = action.payload
      const rtn = {}
      const fields = [latest, editorPicks, reviews, topics,
        photos, infographics, humanRights, landEnvironment, politicalSociety,
        cultureMovie, photoAudio, international, character, transformedJustice]

      fields.forEach((field) => {
        rtn[field] = _.map(_.get(payload, field), (post) => {
          return _.get(post, 'slug')
        })
      })


      return _.merge({}, state, rtn, {
        [latestTopic]: _.get(payload, [latestTopic, 0, 'slug']),
      }, { error: null })
    }

    case types.GET_TOPICS_FOR_INDEX_PAGE: {
      return _.merge({}, state, {
        // only store the topic slugs
        [topics]: _.map(_.get(action, 'payload.items'), (item) => {
          return _.get(item, 'slug')
        }),
      })
    }

    case types.GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE: {
      return _.merge({}, state, {
        // only store the posts slugs
        [photos]: _.map(_.get(action, 'payload.items'), (item) => {
          return _.get(item, 'slug')
        }),
      })
    }

    case types.GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE: {
      return _.merge({}, state, {
        // only store the posts slugs
        [infographics]: _.map(_.get(action, 'payload.items'), (item) => {
          return _.get(item, 'slug')
        }),
      })
    }

    case types.GET_EDITOR_PICKED_POSTS: {
      return _.merge({}, state, {
        // only store the posts slugs
        [editorPicks]: _.map(_.get(action, 'payload.items'), (item) => {
          return _.get(item, 'slug')
        }),
      })
    }

    case types.START_TO_GET_INDEX_PAGE_CONTENT: {
      console.log('url to fetch:', action.url)
      return state
    }

    case types.ERROR_TO_GET_INDEX_PAGE_CONTENT: {
      return _.merge({}, state, {
        error: action.error,
      })
    }

    default:
      return state
  }
}

export default indexPage
