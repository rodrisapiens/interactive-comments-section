import React, { useState, useEffect, useContext } from 'react'
import { ReactComponent as IconPlus } from "../images/icon-plus.svg";
import { ReactComponent as IconMinus } from "../images/icon-minus.svg";
import { ReactComponent as IconReply } from "../images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../images/icon-edit.svg";
import DeleteBox from './DeleteBox';
import { likedContext } from '../Context';
import { AppTimeContext} from '../Context';
import "../styles/commentBox.css";
import { actions } from '../App';
import {auth} from '../App';
function SubCommentBox({ photo, name, comment, mine, subDispatch, id, setAppTime, ownTime,fatherId,peopleLike, peopleNoLike}) {//////////////
    const [likes, setLikes] = useState(0);
    const [timeAgo, setTimeAgo] = useState(0);
    const { appTime } = useContext(AppTimeContext)
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [edit, setEdit] = useState(false);
    const [upDatedComment, setUpDatedComment] = useState(comment);
    const [newComment, setNewComment] = useState("");
    const [reply, setReply] = useState(false);
    const[liked,setLiked]=useState(false);
    const [noLiked,setNoLiked]=useState(false);
    const {hasLiked,setHasLiked}=useContext(likedContext)
    useEffect(() => {
        let status=false;
    peopleLike && peopleLike.forEach((element)=>{
        if(element===auth.currentUser.uid)
        {
            status=true;
        }
    })
      setLiked(status);
    }, [hasLiked,auth])
    useEffect(() => {
        let status=false;
    peopleLike && peopleNoLike.forEach((element)=>{
        if(element===auth.currentUser.uid)
        {
            status=true;
        }
    })
      setNoLiked(status);
    }, [hasLiked,auth])
    
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
        if (seconds > 86400) {
            if (Math.round(seconds / 86400) > 1) {
                response = Math.round(seconds / 86400) + " days ago"
            }
            else {
                response = Math.round(seconds / 86400) + " day ago"
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
        subDispatch({ type: actions.addComment, payLoad: { newComment: newComment, time: Date.now(), photo: auth.currentUser.photoURL, name: auth.currentUser.displayName, fatherId: fatherId,uid:auth.currentUser.uid} })
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
    function handlePlus() {
        subDispatch({ type: actions.like, payLoad: { name: auth.currentUser.uid, id: id, setHasLiked: setHasLiked, hasLiked: hasLiked } })
    }
    function handleMinus() {
        subDispatch({ type: actions.noLike, payLoad: { name: auth.currentUser.uid, id: id, setHasLiked: setHasLiked, hasLiked: hasLiked } })
    }
    return (
        <>
            <div className='subCommentBox'>
                <div className="firstColumn">
                    <img src={photo} alt="" className="thumnail" />
                    <p className="name">{name}</p>
                    {mine && <p className="you">you</p>}
                    <p className="time">{ShowTimeAgo()}</p>
                </div>
                {!edit && <p className="comment">{comment}</p>}
                {edit && <textarea className="comment" value={upDatedComment} onChange={(e) => { handleUpDateComment(e); }}></textarea>}
                <div className="thirdColumn">
                    <div className="buttonsAndLikes">
                    <button className={peopleLike? liked ? "plus like" : "plus" : "plus"} onClick={() => { handlePlus() }}><IconPlus /></button>
                            <span className="numerLikes">{peopleLike ? peopleLike.length : 0}</span>
                        <button className={peopleNoLike? noLiked ? "minus like" : "plus" : "minus"} onClick={() => { handleMinus() }}><IconMinus /></button>
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
                        <img src={auth.currentUser.photoURL} alt="" className="user" />
                        <button className="send" onClick={handleSendComent}>SEND</button>
                    </div>
                </div>
            }
            {showDeleteBox && <DeleteBox setShowDeleteBoxOff={setShowDeleteBox} id={id} subDispatch={subDispatch} father={false} />}
        </>
    )
}

export default SubCommentBox