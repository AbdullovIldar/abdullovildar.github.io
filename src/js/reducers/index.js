import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import * as actions from '../actions/index.js';
const map = handleActions({
  [actions.addMap] (state, {payload: {map} }) {
    return map;
  },
}, null);
const text = handleActions({
    [actions.textUpdate] (state, {payload: {text} }) {
        return text
    } 
}, '')
const points = handleActions({
  [actions.changePointList] (state, {payload: {newPoints, length} }) {
    return newPoints;
  }
}, {})
const polyline = handleActions({
  [actions.addPolyline] (state, {payload: {polyline} }) {
    return polyline
  }
}, null)
export default combineReducers({
    map,
    text,
    points,
    polyline
})