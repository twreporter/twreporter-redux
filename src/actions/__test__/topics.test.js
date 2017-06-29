/* global describe, context, it, afterEach */

/*
  Testing functions:
    fetchAFullTopic
    fetchTopics
    fetchTopicsOnIndexPage
*/


import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import configureMockStore from 'redux-mock-store'
import fieldNames from '../../constants/redux-state-fields'
import nock from 'nock'
import thunk from 'redux-thunk'
import types from '../../constants/action-types'
import * as actions from '../topics'

chai.use(chaiAsPromised)
const expect = chai.expect
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const topic1 = {
  id: 'topic-id-1',
  slug: 'topic-slug-1',
  full: true,
}
const topic2 = {
  id: 'topic-id-2',
  slug: 'topic-slug-2',
  full: true,
}

/* Fetch a full topic, whose assets like relateds, leading_video ...etc are all complete,
 * @param {string} slug - slug of topic
 */
/*
========= Testing fetchAFullTopic ==========
*/
describe('Testing fetchAFullTopic:', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  context('Topic is already existed', () => {
    it('Should dispatch no actions and return Promise.resolve()', () => {
      const mockSlug = 'mock-slug'
      const mockTopic = {
        id: 'mock-id',
        slug: mockSlug,
        full: true,
      }
      const store = mockStore({
        entities: {
          topics: {
            [mockSlug]: mockTopic,
          },
        },
      })
      store.dispatch(actions.fetchAFullTopic(mockSlug))
      expect(store.getActions().length).to.equal(1) // no action is dispatched
      expect(store.getActions()[0].type).to.equal(types.CHANGE_SELECTED_TOPIC)
      expect(store.getActions()[0].payload).to.deep.equal(mockTopic)
    })
  })
  context('It loads a full topic successfully', () => {
    it('Should dispatch types.START_TO_GET_A_FULL_TOPIC and types.GET_A_FULL_TOPIC', () => {
      const mockSlug = 'mock-slug'
      const mockTopic = {
        id: 'mock-id',
        slug: mockSlug,
        full: false,
      }
      const store = mockStore({
        entities: {
          topics: {
            [mockSlug]: mockTopic,
          },
        },
      })
      const mockApiResponse = {
        record: mockTopic,
      }

      nock('http://localhost:8080')
        .get(encodeURI(`/v1/topics/${mockSlug}?full=true`))
        .reply(200, mockApiResponse)

      return store.dispatch(actions.fetchAFullTopic(mockSlug))
        .then(() => {
          expect(store.getActions().length).to.equal(2)  // 2 actions: REQUEST && SUCCESS
          expect(store.getActions()[0].type).to.deep.equal(types.START_TO_GET_A_FULL_TOPIC)
          expect(store.getActions()[0].payload).to.deep.equal({
            slug: mockSlug,
          })
          expect(store.getActions()[1].type).to.equal(types.GET_A_FULL_TOPIC)
          expect(store.getActions()[1].payload).to.deep.equal(mockTopic)
        })
    })
  })
  context('If the api returns a failure', () => {
    it('Should dispatch types.START_TO_GET_A_FULL_TOPIC and types.ERROR_TO_GET_A_FULL_TOPIC', () => {
      const store = mockStore()
      const mockSlug = 'mock-slug'
      nock('http://localhost:8080')
        .get(encodeURI(`/v1/topics/${mockSlug}?full=true`))
        .reply(404)

      return store.dispatch(actions.fetchAFullTopic(mockSlug))
        .then(() => {
          expect(store.getActions().length).to.equal(2)  // 2 actions: REQUEST && FAILURE
          expect(store.getActions()[0].type).to.deep.equal(types.START_TO_GET_A_FULL_TOPIC)
          expect(store.getActions()[1].type).to.equal(types.ERROR_TO_GET_A_FULL_TOPIC)
          expect(store.getActions()[1].error).to.be.an.instanceof(Error)
        })
    })
  })
})

/* Fetch topics(only containing meta properties),
 * and it will load more if (total > items you have currently).
 * @param {number} limit - the number of posts you want to get in one request
 */
/*
========= Testing fetchTopics ==========
*/
describe('Testing fetchTopics:', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  context('There is no more topics to load', () => {
    it('Should dispatch no actions and return Promise.resolve()', () => {
      const store = mockStore({
        [fieldNames.topics]: {
          total: 2,
          items: [topic1, topic2],
        },
      })
      store.dispatch(actions.fetchTopics(10))
      expect(store.getActions().length).to.equal(0) // no action is dispatched
      return expect(store.dispatch(actions.fetchTopics(10))).eventually.equal(undefined)
    })
  })
  context('It loads topics successfully', () => {
    it('Should dispatch types.GET_TOPICS', () => {
      const store = mockStore({
        [fieldNames.topics]: {
          items: [topic1],
          total: 2,
        },
      })
      const limit = 1
      const offset = 1
      const mockApiResponse = {
        records: [
          topic2,
        ],
        meta: {
          limit,
          total: 2,
          offset,
        },
      }
      nock('http://localhost:8080')
        .get(encodeURI(`/v1/topics?limit=${limit}&offset=${offset}`))
        .reply(200, mockApiResponse)

      return store.dispatch(actions.fetchTopics(limit))
        .then(() => {
          expect(store.getActions().length).to.equal(2)  // 2 actions: REQUEST && SUCCESS
          expect(store.getActions()[0].type).to.deep.equal(types.START_TO_GET_TOPICS)
          expect(store.getActions()[1].type).to.equal(types.GET_TOPICS)
          expect(store.getActions()[1].payload).to.deep.equal({
            items: [topic2],
            total: 2,
          })
        })
    })
  })
  context('If the api returns a failure', () => {
    it('Should dispatch types.ERROR_TO_GET_TOPICS', () => {
      const limit = 1
      const offset = 1
      const store = mockStore()
      nock('http://localhost:8080')
        .get(encodeURI(`/v1/topics?limit=${limit}&offset=${offset}`))
        .reply(404)
      return store.dispatch(actions.fetchTopics(limit))
        .then(() => {
          expect(store.getActions().length).to.equal(2)  // 2 actions: REQUEST && FAILURE
          expect(store.getActions()[0].type).to.deep.equal(types.START_TO_GET_TOPICS)
          expect(store.getActions()[1].type).to.equal(types.ERROR_TO_GET_TOPICS)
          expect(store.getActions()[1].error).to.be.an.instanceof(Error)
        })
    })
  })
})

/**
 * fetchTopicsOnIndexPage
 * This function will fetch the 2 to 5 latest topics.
 * It's specifically made for index page
 */
/*
========= Testing  fetchTopicsOnIndexPage ==========
*/
describe('Testing fetchTopicsOnIndexPage:', () => {
  after(() => {
    nock.cleanAll()
  })
  context('index_page.topics are already existed', () => {
    it('Should do nothing', () => {
      const store = mockStore({
        [fieldNames.indexPage]: {
          [fieldNames.topics]: [
            topic1, topic2,
          ],
        },
      })
      store.dispatch(actions.fetchTopicsOnIndexPage())
      expect(store.getActions().length).to.equal(0) // no action is dispatched
      return expect(store.dispatch(actions.fetchTopicsOnIndexPage())).eventually.equal(undefined)
    })
  })

  context('Load topics if needed', () => {
    it('Should dispatch types.GET_TOPICS_FOR_INDEX_PAGE)', () => {
      const store = mockStore({})
      nock('http://localhost:8080')
        .get(encodeURI('/v1/topics?offset=1&limit=4'))
        .reply(200, {
          records: [topic1, topic2],
          meta: {
            limit: 10,
            total: 2,
            offset: 0,
          },
        })

      return store.dispatch(actions.fetchTopicsOnIndexPage())
        .then(() => {
          expect(store.getActions().length).to.equal(2) // START and GET
          expect(store.getActions()[1].type).to.equal(types.GET_TOPICS_FOR_INDEX_PAGE)
          expect(store.getActions()[1].payload.items.length).to.equal(2)
        })
    })
  })
})
