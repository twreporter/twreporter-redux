/* global describe, it*/

import reducer from '../posts'
import types from '../../constants/action-types'

import { expect } from 'chai'

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

describe('posts reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer({}, {}),
    ).to.deep.equal({})
  })

  it('should handle GET_A_FULL_POST', () => {
    expect(
      reducer({}, {
        type: types.GET_A_FULL_POST,
        payload: post1,
      }),
    ).to.deep.equal(post1.slug)
  })

  it('should handle GET_LISTED_POSTS', () => {
    expect(
      reducer({
      }, {
        type: types.GET_LISTED_POSTS,
        payload: {
          items: [post1, post2, post3, post4],
          total: 10,
          listID: 'mock-list-id',
        },
      }),
    ).to.deep.equal({
      'mock-list-id': {
        items: [post1.slug, post2.slug, post3.slug, post4.slug],
        total: 10,
      },
    })
  })
})
