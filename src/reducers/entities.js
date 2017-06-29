/* eslint no-param-reassign: ["error", { "props": false }]*/
import fieldNames from '../constants/redux-state-fields'
import types from '../constants/action-types'

// lodash
import clone from 'lodash/clone'
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'

const _ = {
  get,
  clone,
  map,
  merge,
}

function putEntities(entityArr = [], entityMap) {
  let _entities = entityArr
  if (!Array.isArray(entityArr)) {
    _entities = [entityArr]
  }

  _entities.forEach((entity) => {
    if (!entity) {
      return
    }
    const slug = _.get(entity, 'slug')
    const isFull = _.get(entity, 'full', false)
    if (!Object.prototype.hasOwnProperty.call(entityMap, slug) || isFull) {
      entityMap[slug] = entity
    }
  })
}

// This will normalize the posts and topics.
// EX:
// action = {
//  latest: [{
//    slug: 'post_1'
//    is_feature: false,
//    style: 'article'
//  }, {
//    slug: 'post_2'
//    is_feature: false,
//    style: 'article'
//  }],
//  editor_picks: [{
//    slug: 'post_3',
//    is_feature: true
//    style: 'article'
//  }],
//  reviews: [{
//    slug: 'post_4',
//    is_feature: false
//    style: 'review'
//  }],
//  latest_topics: {
//    slug: 'topic_1',
//    relateds: [{
//      slug: 'post_5'
//      is_feature: false
//      style: 'article'
//    },{
//      slug: 'post_6'
//      is_feature: false
//      style: 'article'
//    }]
//  }
// }
//
// the result will be
// {
//   posts: {
//    'post_1': {
//      slug: 'post_1'
//      is_feature: false,
//      style: 'article'
//    },
//    'post_2': {
//      slug: 'post_2'
//      is_feature: false,
//      style: 'article'
//    },
//    'post_3': {
//      slug: 'post_3'
//      is_feature: true,
//      style: 'article'
//    },
//    'post_4': {
//      slug: 'post_4'
//      is_feature: false,
//      style: 'review'
//    },
//    'post_5': {
//      slug: 'post_5'
//      is_feature: false,
//      style: 'article'
//    },
//    'post_6': {
//      slug: 'post_6'
//      is_feature: false,
//      style: 'article'
//    },
//   },
//   topics: {
//      'topic_1': {
//        slug: 'topic_1',
//        relateds: [ 'post_5', 'post_6']
//      }
//   }
// }
function entities(state = {}, action = {}) {
  const postEntityMap = _.clone(_.get(state, fieldNames.posts, {}))
  const topicEntityMap = _.clone(_.get(state, fieldNames.topics, {}))
  let payload
  switch (action.type) {
    case types.GET_CONTENT_FOR_INDEX_PAGE: {
      putEntities(_.get(action, `payload.${fieldNames.latest}`, []), postEntityMap)
      putEntities(_.get(action, `payload.${fieldNames.editorPicks}`, []), postEntityMap)
      putEntities(_.get(action, `payload.${fieldNames.reviews}`, []), postEntityMap)

      const latestTopic = _.get(action, `payload.${fieldNames.latestTopic}`, {})
      const relatedPostsInTopic = _.get(latestTopic, fieldNames.relateds, [])
      latestTopic[fieldNames.relateds] = _.map(relatedPostsInTopic, (post) => {
        return _.get(post, 'slug')
      })
      putEntities(relatedPostsInTopic, postEntityMap)

      putEntities(_.get(action, `payload.${fieldNames.latestTopic}`), topicEntityMap)

      return _.merge({}, state, {
        [fieldNames.posts]: postEntityMap,
        [fieldNames.topics]: topicEntityMap,
      })
    }

    case types.GET_TOPICS_FOR_INDEX_PAGE: {
      // topics we get from api
      payload = _.get(action, 'payload.items', [])

      putEntities(payload, topicEntityMap)

      return _.merge({}, state, {
        [fieldNames.topics]: topicEntityMap,
      })
    }

    case types.GET_EDITOR_PICKED_POSTS:
    case types.GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE:
    case types.GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE:
    case types.GET_LISTED_POSTS: {
      // topics we get from api
      payload = _.get(action, 'payload.items', [])

      putEntities(payload, postEntityMap)

      return _.merge({}, state, {
        [fieldNames.posts]: postEntityMap,
      })
    }

    case types.GET_A_FULL_POST: {
      const post = _.get(action, 'payload', {})
      const topic = _.get(post, fieldNames.topics, {})
      putEntities(topic, topicEntityMap)
      post[fieldNames.topics] = _.get(topic, 'slug')

      const relatedPosts = _.get(post, fieldNames.relateds, [])
      post[fieldNames.relateds] = _.map(relatedPosts, (_post) => {
        return _.get(_post, 'slug')
      })
      putEntities(relatedPosts, postEntityMap)

      // set full post into post entities
      putEntities([post], postEntityMap)

      return _.merge({}, state, {
        [fieldNames.posts]: postEntityMap,
        [fieldNames.topics]: topicEntityMap,
      })
    }

    case types.GET_A_FULL_TOPIC: {
      const topic = _.get(action, 'payload', {})

      const relatedPosts = _.get(topic, fieldNames.relateds, [])
      topic[fieldNames.relateds] = _.map(relatedPosts, (post) => {
        return _.get(post, 'slug')
      })
      putEntities(relatedPosts, postEntityMap)

      // set full topic into topic entities
      putEntities([topic], topicEntityMap)

      return _.merge({}, state, {
        [fieldNames.posts]: postEntityMap,
        [fieldNames.topics]: topicEntityMap,
      })
    }

    default: {
      return state
    }
  }
}

export default entities
