import React, { useState, useEffect, useContext } from 'react'
import { ReactComponent as IconPlus } from "../images/icon-plus.svg";
import { ReactComponent as IconMinus } from "../images/icon-minus.svg";
import { ReactComponent as IconReply } from "../images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../images/icon-edit.svg";
import userImage from "../images/avatars/image-juliusomo.png";
import DeleteBox from './DeleteBox';
import { AppTimeContext, CurrentUserContext } from '../Context';
import "../styles/commentBox.css";
import { actions } from '../App';
function SubCommentBox({ photo, name, comment, mine, subDispatch, id, setAppTime, ownTime,fatherId}) {//////////////
    const [likes, setLikes] = useState(0);
    const [timeAgo, setTimeAgo] = useState(0);
    const { appTime } = useContext(AppTimeContext)
    const { currentUser } = useContext(CurrentUserContext)
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [edit, setEdit] = useState(false);
    const [upDatedComment, setUpDatedComment] = useState(comment);
    const [newComment, setNewComment] = useState("");
    const [reply, setReply] = useState(false);
    
    function ShowTimeAgo() {
        let seconds = Math.round(timeAgo / 1000);
        let response;
        if (seconds < 1) {
            response = "now";
        }
        if (seconds > 1) {
            response = seconds + " seconds ago"
        }
        if (seconds > 60) {
            if (Math.round(seconds / 60) > 1) {
                response = Math.round(seconds / 60) + " minutes ago"
            }
            else {

                response = Math.round(seconds / 60) + " minute ago"

            }
        }
        if (seconds > 3600) {
            if (Math.round(seconds / 3600) > 1) {
                response = Math.round(seconds / 3600) + " hours ago"
            }
            else {
                response = Math.round(seconds / 3600) + " hour ago"
            }
        }
        return (response);
    }
    useEffect(() => {
        setTimeAgo(appTime - ownTime)

    }, [appTime])

    function handleShow() {
        if (mine) {
            return <div className='myFoot'>
                <IconDelete onClick={() => { setShowDeleteBox(true) }} />
                <button className="delete" onClick={() => { setShowDeleteBox(true) }}>Delete</button>
                <IconEdit onClick={() => { setEdit(!edit); subDispatch({ type: actions.upDate, payLoad: { id: id, upDatedComment: upDatedComment } }) }} />
                <button className="edit" onClick={() => { setEdit(!edit); subDispatch({ type: actions.upDate, payLoad: { id: id, upDatedComment: upDatedComment } }) }}>{edit ? "Done" : "Edit"}</button>
            </div>
        }
        else {
            return <div className='elseFoot'>
                <IconReply onClick={HandleReply} />
                <button className="reply" onClick={HandleReply}>Reply</button>
            </div>
        }
    }
    function handleSendComent() {
        setReply(false);
        setAppTime(Date.now());
        subDispatch({ type: actions.addComment, payLoad: { newComment: newComment, time: Date.now(), photo: userImage, name: "juliusomo", fatherId: fatherId } })
        setNewComment("")
    }
    function HandleReply() {
        setReply(true);
        setNewComment(`@${name} `);
    }
    function handleUpDateComment(e) {

        setUpDatedComment(e.currentTarget.value)
    }
    function handleInput(e) {
        setNewComment(e.currentTarget.value);
    }
    return (
        <>
            <div className='subCommentBox'>
                <div className="firstColumn">
                    <img src={photo} alt="" className="thumnail" />
                    <p className="name">{currentUser}</p>
                    {mine && <p className="you">you</p>}
                    <p className="time">{ShowTimeAgo()}</p>
                </div>
                {!edit && <p className="comment">{comment}</p>}
                {edit && <textarea className="comment" value={upDatedComment} onChange={(e) => { handleUpDateComment(e); }}></textarea>}
                <div className="thirdColumn">
                    <div className="buttonsAndLikes">
                        <button className="plus" onClick={() => { setLikes(likes + 1) }}><IconPlus /></button>
                        <span className="numerLikes">{likes}</span>
                        <button className="minus" onClick={() => { setLikes(likes - 1) }}><IconMinus /></button>
                    </div>
                    <div className="footSection">
                        {
                            handleShow()
                        }
                    </div>


                </div>
            </div>
            {reply &&
                <div className="inputBoxB">
                    <textarea type="text" required placeholder='Add a comment...' className='commentInputB' onChange={handleInput} value={newComment}></textarea>
                    <div className="secondRaw">
                        <img src={userImage} alt="" className="user" />
                        <button className="send" onClick={handleSendComent}>SEND</button>
                    </div>
                </div>
            }
            {showDeleteBox && <DeleteBox setShowDeleteBoxOff={setShowDeleteBox} id={id} subDispatch={subDispatch} father={false} />}
        </>
    )
}

export default SubCommentBox