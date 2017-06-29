/* global describe, it*/


import fieldNames from '../../constants/redux-state-fields'
import reducer from '../entities'
import types from '../../constants/action-types'

// lodash
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

import { expect } from 'chai'

const _ = {
  cloneDeep,
  merge,
}

const post1 = {
  id: 'post-id-1',
  slug: 'post-slug-1',
}

const post2 = {
  id: 'post-id-2',
  slug: 'post-slug-2',
}

const post3 = {
  id: 'post-id-3',
  slug: 'post-slug-3',
}

const post4 = {
  id: 'post-id-4',
  slug: 'post-slug-4',
}

const fullTopic = {
  id: 'topic-id-1',
  slug: 'topic-slug-1',
  relateds: [post3, post4],
  full: true,
}

const nonFullTopic = {
  id: 'topic-id-1',
  slug: 'topic-slug-1',
  full: false,
}

describe('entities reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer({}, {}),
    ).to.deep.equal({})
  })

  it('should handle GET_CONTENT_FOR_INDEX_PAGE', () => {
    expect(
      reducer({
        posts: {
          [post1.slug]: _.cloneDeep(post1),
        },
        topics: {
          [fullTopic.slug]: _.cloneDeep(fullTopic),
        },
      }, {
        type: types.GET_CONTENT_FOR_INDEX_PAGE,
        payload: {
          [fieldNames.latest]: _.cloneDeep([post1, post2]),
          [fieldNames.editorPicks]: _.cloneDeep([post1]),
          [fieldNames.reviews]: _.cloneDeep([post3]),
          [fieldNames.latestTopic]: _.cloneDeep(fullTopic),
        },
      }),
    ).to.deep.equal({
      posts: {
        'post-slug-1': post1,
        'post-slug-2': post2,
        'post-slug-3': post3,
        'post-slug-4': post4,
      },
      topics: {
        'topic-slug-1': _.merge({}, fullTopic, {
          relateds: [post3.slug, post4.slug],
        }),
      },
    })
  })

  it('should handle GET_TOPICS_FOR_INDEX_PAGE', () => {
    expect(
      reducer({
      }, {
        type: types.GET_TOPICS_FOR_INDEX_PAGE,
        payload: {
          items: _.cloneDeep([nonFullTopic]),
        },
      }),
    ).to.deep.equal({
      topics: {
        [nonFullTopic.slug]: nonFullTopic,
      },
    })
  })

  it('should handle GET_EDITOR_PICKED_POSTS', () => {
    expect(
      reducer({
      }, {
        type: types.GET_EDITOR_PICKED_POSTS,
        payload: {
          items: _.cloneDeep([post1]),
        },
      }),
    ).to.deep.equal({
      posts: {
        [post1.slug]: post1,
      },
    })
  })

  it('should handle GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE', () => {
    expect(
      reducer({
      }, {
        type: types.GET_PHOTOGRAPHY_POSTS_FOR_INDEX_PAGE,
        payload: {
          items: _.cloneDeep([post1]),
        },
      }),
    ).to.deep.equal({
      posts: {
        [post1.slug]: post1,
      },
    })
  })

  it('should handle GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE', () => {
    expect(
      reducer({
      }, {
        type: types.GET_INFOGRAPHIC_POSTS_FOR_INDEX_PAGE,
        payload: {
          items: _.cloneDeep([post1]),
        },
      }),
    ).to.deep.equal({
      posts: {
        [post1.slug]: post1,
      },
    })
  })

  it('should handle GET_LISTED_POSTS', () => {
    expect(
      reducer({
      }, {
        type: types.GET_LISTED_POSTS,
        payload: {
          items: _.cloneDeep([post1]),
        },
      }),
    ).to.deep.equal({
      posts: {
        [post1.slug]: post1,
      },
    })
  })

  it('should handle GET_A_FULL_POST', () => {
    const post = _.cloneDeep(post1)
    post.relateds = [post2, post3]
    post.topics = nonFullTopic

    expect(
      reducer({
      }, {
        type: types.GET_A_FULL_POST,
        payload: post,
      }),
    ).to.deep.equal({
      posts: {
        [post1.slug]: _.merge(
          post1, {
            relateds: [post2.slug, post3.slug],
            topics: nonFullTopic.slug,
          },
        ),
        [post2.slug]: post2,
        [post3.slug]: post3,
      },
      topics: {
        [nonFullTopic.slug]: nonFullTopic,
      },
    })
  })

  it('should handle GET_A_FULL_TOPIC', () => {
    const topic = _.cloneDeep(fullTopic)
    expect(
      reducer({
      }, {
        type: types.GET_A_FULL_TOPIC,
        payload: topic,
      }),
    ).to.deep.equal({
      posts: {
        [post3.slug]: post3,
        [post4.slug]: post4,
      },
      topics: {
        [topic.slug]: topic,
      },
    })
  })
})
