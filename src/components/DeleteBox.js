import React from 'react'
import "../styles/deleteBox.css";
import { actions } from '../App';
function DeleteBox({ setShowDeleteBoxOff, dispatch, id,father,subDispatch }) {
    return (
        <div className='deleteboxBG'>
            <div className='deleteBox'>
                <h2 className="titleDelete">Delete Comment</h2>
                <p className="textDelete">
                    Are you sure you want to delete this comment? this wil remove the comment
                    and can't be undone.
                </p>
                <div className="buttonsDelete">
                    <button className="noCancel" onClick={() => { setShowDeleteBoxOff(false) }}>NO,CANCEL</button>
                    <button className="yesDelete" onClick={() => {father?dispatch({ type: actions.delete, payLoad: { id: id } }):subDispatch({ type: actions.delete, payLoad: { id: id } }); setShowDeleteBoxOff(false) }}>YES,DELETE</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteBox