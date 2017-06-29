/* global describe, it*/

import reducer from '../topics'
import types from '../../constants/action-types'
import { expect } from 'chai'

const topic1 = {
  id: 'topic-id-1',
  slug: 'topic-slug-1',
}

const topic2 = {
  id: 'topic-id-2',
  slug: 'topic-slug-2',
}


describe('topics reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer({}, {}),
    ).to.deep.equal({})
  })

  it('should handle GET_A_FULL_TOPIC', () => {
    expect(
      reducer({}, {
        type: types.GET_A_FULL_TOPIC,
        payload: topic1,
      }),
    ).to.deep.equal(topic1.slug)
  })

  it('should handle GET_TOPICS', () => {
    expect(
      reducer({
      }, {
        type: types.GET_TOPICS,
        payload: {
          items: [topic1, topic2],
          total: 10,
        },
      }),
    ).to.deep.equal({
      items: [topic1.slug, topic2.slug],
      total: 10,
    })
  })
})
