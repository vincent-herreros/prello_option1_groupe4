import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Card, Grid, Input, Form, Button} from 'semantic-ui-react';
//import MenuParameters from '../../components/BoardParameters/MenuParameters';
import BoardComponent from '../../components/Board/Board.component';
import BoardMenu from './BoardMenu';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {callAddList, callUpdateCardPositionInList, callUpdateCardPositionBetweenList} from '../../objects/List/ListAsyncActions';
import {callUpdateListPositionInBoard} from '../../objects/Board/BoardAsyncActions';
import style from './board.styl'

class Board extends Component {
    constructor(props) {
        super(props)
        this.state ={
            nameList: "",
        }
    }

    handleAddList=(e)=>{
        if (e.key === 'Enter') {
            const elem = e.target;
            e.preventDefault();
            if (elem.value) {
                this.props.dispatchCallAddList(({titleList: elem.value, positionList: 0}), this.props.board);
                elem.value = '';
            }
        }
        else if(e.type=="submit"){
            this.props.dispatchCallAddList(({titleList: this.state.nameList, positionList: 0}), this.props.board);
        }
    }

    render () {
        if(this.props.board){
            if(this.props.lists){
                return(
                    <div className={style.generalBoardRendering}>
                        <BoardMenu board={this.props.board}/>
                        {this.listsIsFilled()}
                    </div>
                )
            }else{
                return(
                    <div className={style.generalBoardRendering}>
                        <BoardMenu board={this.props.board}/>
                        <Form onSubmit={this.handleAddList}>
                                <Form.Group inline>
                                    <Form.Field>
                                        <Input type='text' onKeyPress={this.handleAddList} onChange={(name)=> this.setState({nameList: name.target.value})} placeholder='Add a List'></Input>
                                    </Form.Field>
                                    <Form.Field>
                                        <Button type="submit">Add</Button>
                                    </Form.Field>
                                </Form.Group>
                        </Form>
                    </div>
                )
            }

        }
        else{
            return <div/>
        }
    }

    onDragEnd =result => {
        const {destination, source, draggableId, type} = result;

        if(!destination){
            return;
        }

        if(
            destination.draggableId === source.droppableId &&
            destination.index === source.index
        ){
            return;
        }

        if(type === 'column'){
            const newListOrder = Array.from(this.props.board.listsId)
            newListOrder.splice(source.index, 1);
            newListOrder.splice(destination.index, 0, draggableId);
            const newBoard = {
                ...this.props.board,
                listsId: newListOrder,
            }
            this.props.dispatchUpdateListPositionInBoard(newBoard);
            return;
        }

        const start = this.props.lists.find(el => el._id === source.droppableId);
        const finish = this.props.lists.find(el => el._id === destination.droppableId);
        
        if(start === finish){
            const newCardIds = Array.from(start.cards);
            newCardIds.splice(source.index, 1);
            newCardIds.splice(destination.index, 0, draggableId);
            const newList = {
                ...start,
                cards: newCardIds
            };
            this.props.dispatchUpdateCardPositionInList(newList);
            return;
        }

        //Moving to one list to another
        const startCardIds = Array.from(start.cards);
        startCardIds.splice(source.index, 1);
        const newStart = {
            ...start,
            cards: startCardIds,
        };

        const finishCardIds = Array.from(finish.cards);
        finishCardIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            cards: finishCardIds,
        };

        this.props.dispatchUpdateCardPositionBetweenList({startList: newStart, finishList: newFinish})

    }

    listsIsFilled = () => {
        if(this.props.lists){
            return(<DragDropContext
                    onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="all-columns" direction="horizontal" type="column">
                            {provided => (
                                <div
                                {...provided.droppableProps} 
                                ref={provided.innerRef}>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column mobile={16} tablet={16} computer={16} >
                                                <div className={style.margin}>
                                                    <div className={style.listBox}>
                                                        <BoardComponent board={this.props.board._id} lists={this.props.lists}/>
                                                        <div className={style.cardCustom}>
                                                            <Card className={style.ListCard}>
                                                            <Form onSubmit={this.handleAddList}>
                                                                <Form.Group inline>
                                                                    <Form.Field>
                                                                        <Input type='text' onKeyPress={this.handleAddList} onChange={(name)=> this.setState({nameList: name.target.value})} placeholder='Add a List'></Input>
                                                                    </Form.Field>
                                                                    <Form.Field>
                                                                        <Button type="submit">Add</Button>
                                                                    </Form.Field>

                                                                </Form.Group>
                                                            </Form>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>

                                {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>);
        }
        else{
            return <div/>
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    let listB=[];
    let board = state.boards.find(el => el._id === ownProps.location.state.id);
    state.lists.find(x => {
        let board = state.boards.find(el => el._id === ownProps.location.state.id);
        if(board){
            if(board.listsId.includes(x._id)){
                listB.push(x);
            };
        }
    })
    var result = []
    if(listB && board){
        board.listsId.forEach((list)=> {
            listB.forEach((element) => {
                if(element._id === list){
                    result.push(element);
                }
            })
        })
    }
    return ({
        lists: result.filter(el => el.isDeletedList === false && el.isArchivedList === false),
        boards: state.boards,
        board: state.boards.find(el => el._id === ownProps.location.state.id)
    })
}

function mapDispatchToProps(dispatch){
    return{
        dispatchCallAddList: (data, board) => dispatch(callAddList(data, board)),
        dispatchUpdateCardPositionInList : (data) => dispatch(callUpdateCardPositionInList(data)),
        dispatchUpdateCardPositionBetweenList: (data) => dispatch(callUpdateCardPositionBetweenList(data)),
        dispatchUpdateListPositionInBoard: (data) => dispatch(callUpdateListPositionInBoard(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Board)