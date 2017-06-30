/* eslint no-param-reassign: ["error", { "props": false }]*/
import fieldNames from '../constants/redux-state-fields'
import types from '../constants/action-types'

// lodash
import get from 'lodash/get'
import map from 'lodash/map'
import merge from 'lodash/merge'

const _ = {
  get,
  map,
  merge,
}

function normalizeTopic(topic, postEntities, topicEntities) {
  if (typeof topic !== 'object') {
    return {
      postEntities,
      topicEntities,
    }
  }

  if (topic.full) {
    const relateds = _.get(topic, fieldNames.relateds, [])

    topic.relateds = relateds.map((post) => {
      if (typeof post === 'object') {
        if (!postEntities[post.slug] || post.full) {
          postEntities[post.slug] = post
        }
      }
      return _.get(post, 'slug', '')
    })
  }

  if (!topicEntities[topic.slug] || topic.full) {
    topicEntities[topic.slug] = topic
  }

  return {
    postEntities,
    topicEntities,
  }
}

function normalizePost(post, _postEntities, _topicEntities) {
  let postEntities = _postEntities
  let topicEntities = _topicEntities
  if (typeof post !== 'object') {
    return {
      postEntities,
      topicEntities,
    }
  }

  const postSlug = post.slug

  if (post.full) {
    const topic = _.get(post, fieldNames.topics)
    const normalizedObj = normalizeTopic(topic, postEntities, topicEntities)
    postEntities = normalizedObj.postEntities
    topicEntities = normalizedObj.topicEntities
    post[fieldNames.topics] = _.get(topic, 'slug', topic)

    post[fieldNames.relateds] = _.map(post.relateds, (_post) => {
      if (typeof _post === 'object') {
        if (!postEntities[_post.slug] || _post.full) {
          postEntities[_post.slug] = _post
        }
      }
      return _.get(_post, 'slug', _post)
    })
  }

  if (!postEntities[postSlug] || post.full) {
    postEntities[postSlug] = post
  }

  return {
    postEntities,
    topicEntities,
  }
}

function normalizeAssets(assets, _postEntities, _topicEntities, style) {
  let postEntities = _postEntities
  let topicEntities = _topicEntities
  if (!Array.isArray(assets)) {
    return {
      postEntities,
      topicEntities,
    }
  }

  const normalize = style === 'post' ? normalizePost : normalizeTopic

  assets.forEach((asset) => {
    const normalizedObj = normalize(asset, postEntities, topicEntities)
    postEntities = normalizedObj.postEntities
    topicEntities = normalizedObj.topicEntities
  })

  return {
    postEntities,
    topicEntities,
  }
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
  let payload
  let normalizedObj = {
    postEntities: _.get(state, fieldNames.posts, {}),
    topicEntities: _.get(state, fieldNames.topics, {}),
  }
  switch (action.type) {
    case types.GET_CONTENT_FOR_INDEX_PAGE: {
      payload = action.payload
      const sections = [fieldNames.latest, fieldNames.editorPicks, fieldNames.reviews, fieldNames.photos, fieldNames.infographics]

      sections.forEach((section) => {
        const posts = _.get(payload, section, [])
        normalizedObj = normalizeAssets(posts, normalizedObj.postEntities, normalizedObj.topicEntities, 'post')
      })

      normalizedObj = normalizeTopic(_.get(payload, [fieldNames.latestTopic, 0]), normalizedObj.postEntities, normalizedObj.topicEntities)
      normalizedObj = normalizeAssets(_.get(payload, fieldNames.topics, []), normalizedObj.postEntities, normalizedObj.topicEntities, 'topic')

      return _.merge({}, state, {
        [fieldNames.posts]: normalizedObj.postEntities,
        [fieldNames.topics]: normalizedObj.topicEntities,
      })
    }

    case types.GET_TOPICS_FOR_INDEX_PAGE: {
      payload = _.get(action, 'payload.items', [])

      normalizedObj = normalizeAssets(payload, normalizedObj.postEntities, normalizedObj.topicEntities, 'topic')

      return _.merge({}, state, {
        [fieldNames.posts]: normalizedObj.postEntities,
        [fieldNames.topics]: normalizedObj.topicEntities,
      })
    }

    case types.GET_EDITOR_PICKED_POSTS:
    case types.GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE:
    case types.GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE:
    case types.GET_LISTED_POSTS: {
      payload = _.get(action, 'payload.items', [])

      normalizedObj = normalizeAssets(payload, normalizedObj.postEntities, normalizedObj.topicEntities, 'post')

      return _.merge({}, state, {
        [fieldNames.posts]: normalizedObj.postEntities,
        [fieldNames.topics]: normalizedObj.topicEntities,
      })
    }

    case types.GET_A_FULL_POST: {
      const post = _.get(action, 'payload', {})
      normalizedObj = normalizePost(post, normalizedObj.postEntities, normalizedObj.topicEntities)

      return _.merge({}, state, {
        [fieldNames.posts]: normalizedObj.postEntities,
        [fieldNames.topics]: normalizedObj.topicEntities,
      })
    }

    case types.GET_A_FULL_TOPIC: {
      const topic = _.get(action, 'payload', {})
      normalizedObj = normalizeTopic(topic, normalizedObj.postEntities, normalizedObj.topicEntities)

      return _.merge({}, state, {
        [fieldNames.posts]: normalizedObj.postEntities,
        [fieldNames.topics]: normalizedObj.topicEntities,
      })
    }

    default: {
      return state
    }
  }
}

export default entities
