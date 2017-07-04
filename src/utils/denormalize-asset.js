import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import set from 'lodash/set'
import reduxStateFields from '../constants/redux-state-fields'

const _ = {
  cloneDeep,
  get,
  set,
}

const denormalizePosts = (slugs, entities = {}) => {
  let _slugs = slugs
  if (!Array.isArray(slugs)) {
    _slugs = [slugs]
  }
  const posts = _slugs.map((slug) => {
    return _.cloneDeep(entities[slug])
  })

  return posts
}

const denormalizeTopics = (topicSlugs, topicEntities = {}, postEntities = {}) => {
  let slugs = topicSlugs
  if (!Array.isArray(topicSlugs)) {
    slugs = [topicSlugs]
  }
  const topics = slugs.map((slug) => {
    const topic = _.cloneDeep(topicEntities[slug])
    const relatedSlugs = _.get(topic, reduxStateFields.relateds, [])
    const relateds = denormalizePosts(relatedSlugs, postEntities)
    _.set(topic, reduxStateFields.relateds, relateds)
    return topic
  })

  return topics
}

export {
  denormalizePosts,
  denormalizeTopics,
}
