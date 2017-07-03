/** These strings are used for field key of redux state
 * Redux state will be like
 *  {
 *    index_page: {
 *      latest: [],
 *      editor_picks: [],
 *      latest_topic: [],
 *      reviews: [],
 *      topics: [],
 *      photos: [],
 *      infographics: [],
 *    },
 *    entities: {
 *      posts: {},
 *      topics: {},
 *    },
 *    lists: {
 *      listID1: {
 *        total: 10,
 *        items: [],
 *      },
 *      listID2: {
 *        total: 15,
 *        items: []
 *      }
 *    },
 *    topics: {
 *      total: 10,
 *      items: []
 *    }
 *  }
 *
 */

const indexPage = 'index_page'
const entities = 'entities'
const lists = 'lists'
const selectedPost = 'selected_post'
const selectedTopic = 'selected_topic'

const posts = 'posts'
const topics = 'topics'

const latestTopic = 'latest_topic'
const latest = 'latest'
const editorPicks = 'editor_picks'
const reviews = 'reviews'
const relateds = 'relateds'
const photos = 'photos'
const infographics = 'infographics'

const humanRights = 'human_rights'
const landEnvironment = 'land_environment'
const politicalSociety = 'political_society'
const cultureMovie = 'culture_movie'
const photoAudio = 'photo_audio'
const international = 'international'
const character = 'character'
const transformedJustice = 'transformed_justice'

export default {
  indexPage,
  entities,
  lists,
  selectedPost,
  selectedTopic,
  posts,
  topics,
  latest,
  latestTopic,
  editorPicks,
  reviews,
  relateds,
  photos,
  infographics,
  humanRights,
  landEnvironment,
  politicalSociety,
  cultureMovie,
  photoAudio,
  international,
  character,
  transformedJustice,
}
