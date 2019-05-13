import { combineReducers } from 'redux'
import { posts } from './posts'
import entities from './entities'
import fieldNames from '../constants/redux-state-field-names'
import indexPage from './index-page'

const rootReducer = combineReducers({
  [fieldNames.indexPage]: indexPage,
  [fieldNames.entities]: entities,
  [fieldNames.selectedArticle]: posts,
  [fieldNames.lists]: posts,
})

export default rootReducer
