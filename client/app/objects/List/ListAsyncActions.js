import asteroid from '../../common/asteroid';
import { addList, getAllList, removeList, updateListPosition, updateListTitle,deleteList, archiveList, unarchiveList } from './ListActions';
import { callUpdateBoardListId, callUpdateListsPosition, callUpdateListsPositionsAfterArchiveOrDelete} from '../Board/BoardAsyncActions';

export function callAddList(data, board) {
  return dispatch => asteroid.call('addList', data)
      .then(result => {
          dispatch(addList({ ...{_id: result}, ...data }))
          dispatch(callUpdateBoardListId(result, board))
        });
}
export function callUpdatePositionList(data, board) {
    return dispatch => asteroid.call('updateList', data)
        .then(result => {
            dispatch(updateListPosition({ ...{_id: result}, ...data}))
            dispatch(callUpdateListsPosition(result, board))
        })
}
export function callGetAllList() {
    return dispatch => asteroid.call('getList')
        .then(result => dispatch(getAllList(result)));
  }

export function callRemoveList(_id) {
    return dispatch => asteroid.call('removeList', _id)
        .then(() => dispatch(removeList(_id)));
}

export function callEditListTitle(data) {
    return dispatch => asteroid.call('updateList', data)
        .then(result => dispatch(updateListTitle(result)))
}

export function callDeleteUnarchivedList(data, board) {
    return dispatch => asteroid.call('updateList', data)
        .then(result => {
            dispatch(deleteList(result))
            dispatch(callUpdateListsPositionsAfterArchiveOrDelete(result, board))
        })
}

export function callArchiveList(data, board) {
    return dispatch => asteroid.call('updateList', data)
        .then(result => {
            dispatch(archiveList(result))
            dispatch(callUpdateListsPositionsAfterArchiveOrDelete(result, board))
        })
}

export function callUnarchiveList(data, board) {
    return dispatch => asteroid.call('unarhiveList', data)
        .then(result => {
            dispatch(unarchiveList(result))
            //TODO: add the function that give the position of the list (end)
        })
}