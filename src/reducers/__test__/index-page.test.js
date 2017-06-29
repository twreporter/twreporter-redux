/* global describe, it*/


import fieldNames from '../../constants/redux-state-fields'
import reducer from '../index-page'
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

describe('index-page reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer({}, {}),
    ).to.deep.equal({})
  })

  it('should handle GET_CONTENT_FOR_INDEX_PAGE', () => {
    expect(
      reducer({}, {
        type: types.GET_CONTENT_FOR_INDEX_PAGE,
        payload: {
          [fieldNames.latest]: _.cloneDeep([post1, post2]),
          [fieldNames.editorPicks]: _.cloneDeep([post4]),
          [fieldNames.reviews]: _.cloneDeep([post3]),
          [fieldNames.latestTopic]: _.cloneDeep(fullTopic),
        },
      }),
    ).to.deep.equal({
      [fieldNames.latest]: [post1.slug, post2.slug],
      [fieldNames.editorPicks]: [post4.slug],
      [fieldNames.reviews]: [post3.slug],
      [fieldNames.latestTopic]: fullTopic.slug,
    })
  })

  it('should handle GET_TOPICS_FOR_INDEX_PAGE', () => {
    expect(
      reducer({
      }, {
        type: types.GET_TOPICS_FOR_INDEX_PAGE,
        payload: {
          items: _.cloneDeep([nonFullTopic, fullTopic]),
        },
      }),
    ).to.deep.equal({
      [fieldNames.topics]: [nonFullTopic.slug, fullTopic.slug],
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
      [fieldNames.photographies]: [post1.slug],
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
      [fieldNames.infographics]: [post1.slug],
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
      [fieldNames.editorPicks]: [post1.slug],
    })
  })
})
