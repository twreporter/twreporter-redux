import indexPage from './index-page'
import entities from './entities'
import fieldNames from '../constants/redux-state-fields'
import posts from './posts'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  [fieldNames.indexPage]: indexPage,
  [fieldNames.entities]: entities,
  [fieldNames.selectedArticle]: posts,
  [fieldNames.lists]: posts,
})

export default rootReducer
