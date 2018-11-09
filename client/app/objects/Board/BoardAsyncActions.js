import asteroid from '../../common/asteroid';
import { getBoard, addBoard , updateBoardListId} from './BoardActions';

export function callGetBoard(idBoard) {
    return dispatch => asteroid.call('getBoard', idBoard)
        .then(result => dispatch(getBoard(result)));
}

export function callAddBoard(data) {
    let finaldata = {...data, ...{admins:[data.user], members:[data.user]}};
    if(data.team){
        finaldata = {...data, ...{teams:[data.team], admins:[data.user], members:[data.user]}}
    }
    return dispatch => asteroid.call('addBoard', finaldata)
        .then(result => dispatch(addBoard({ ...{_id: result}, ...finaldata})));
}

export function callUpdateBoardListId(id, board){
    console.log(id)
    console.log(board)
    return dispatch => asteroid.call('updateBoardListId', {id: board._id, listId: id})
        .then(/*dispatch(updateBoardListId({id: board._id, listid: id}))*/);
}
