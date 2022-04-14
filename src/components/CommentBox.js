import React, { useState, useEffect, useContext, useReducer } from 'react'
import { ReactComponent as IconPlus } from "../images/icon-plus.svg";
import { ReactComponent as IconMinus } from "../images/icon-minus.svg";
import { ReactComponent as IconReply } from "../images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../images/icon-edit.svg";
import { AppTimeContext, likedContext } from '../Context';
import "../styles/commentBox.css";
import DeleteBox from './DeleteBox';
import { actions, auth, db } from '../App';
import SubCommentBox from './SubCommentBox';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    updateDoc
} from 'firebase/firestore'
function reducer(listSubComments, action) {
    switch (action.type) {
        case actions.addComment:
            {
                return [...listSubComments, createNewComment(action.payLoad.newComment, action.payLoad.photo, action.payLoad.time, action.payLoad.name, action.payLoad.fatherId, action.payLoad.uid)]
            }
        case actions.delete:
            {

                return listSubComments.filter((comment) => { return comment.key !== action.payLoad.id })
            }
        case actions.upDate:
            return listSubComments.map((comentObj) => {
                if (comentObj.key === action.payLoad.id) {
                    comentObj.comment = action.payLoad.upDatedComment;
                }
                return comentObj;
            })
        case actions.charge:
            return action.payLoad.listComments
        case actions.like:
            {
                let status;
                status = false;
                action.payLoad.setHasLiked(!action.payLoad.hasLiked)
                return listSubComments.map((comentObj) => {
                    if (comentObj.key === action.payLoad.id) {
                        comentObj.peopleLike.forEach((element) => {
                            if (action.payLoad.name === element) {//ya estaba
                                status = true;
        
                            }
                        })
                        if (status) {
                            comentObj.peopleLike = [...comentObj.peopleLike.filter((element) => {
                                return element !== action.payLoad.name
                            })]
                        }

                        else {
                            comentObj.peopleLike = [...comentObj.peopleLike, addnewPerson(action.payLoad.name)]
                        }
                    }
                    return comentObj;
                })
            }
        case actions.noLike:
            {
                let status;
                status = false;
                action.payLoad.setHasLiked(!action.payLoad.hasLiked)
                return listSubComments.map((comentObj) => {
                    if (comentObj.key === action.payLoad.id) {
                        comentObj.peopleNoLike.forEach((element) => {
                            if (action.payLoad.name === element) {//ya estaba
                                status = true;
                            }
                        })
                        if (status) {
                            comentObj.peopleNoLike = [...comentObj.peopleNoLike.filter((element) => {
                                return element !== action.payLoad.name
                            })]
                        }

                        else {
                            comentObj.peopleNoLike = [...comentObj.peopleNoLike, addnewPerson(action.payLoad.name)]
                        }

                    }
                    return comentObj;
                })
            }
        default:
            return listSubComments;
    }
}
function createNewComment(newComment, photo, time, name, fatherId, uid) {
    return { key: Date.now(), photo: photo, name: name, time: time, comment: newComment, fatherId: fatherId, ownTime: Date.now(), uid: uid,peopleLike: [], peopleNoLike: [] }
}
function addnewPerson(person)
{
  return person;
}
function CommentBox({ id, name, comment, photo, mine, dispatch, setAppTime, ownTime, peopleLike, peopleNoLike }) {///////////
    const [timeAgo, setTimeAgo] = useState(0);
    const { appTime } = useContext(AppTimeContext)
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [edit, setEdit] = useState(false);
    const [upDatedComment, setUpDatedComment] = useState(comment);
    const [listSubComents, subDispatch] = useReducer(reducer, []);
    const [newComment, setNewComment] = useState("");
    const [reply, setReply] = useState(false);
    const messagesCol = collection(db, 'messages');
    const [liked, setLiked] = useState(false);
    const [noLiked, setNoLiked] = useState(false);
    const { hasLiked, setHasLiked } = useContext(likedContext)
    useEffect(() => {
        let status = false;
        peopleLike && peopleLike.forEach((element) => {
            if (element === auth.currentUser.uid) {
                status = true;
            }
        })
        setLiked(status);
    }, [hasLiked, auth])
    useEffect(() => {
        let status = false;
        peopleLike && peopleNoLike.forEach((element) => {
            if (element === auth.currentUser.uid) {
                status = true;
            }
        })
        setNoLiked(status);
    }, [hasLiked, auth])

    useEffect(() => {
        getDocs(messagesCol).then((snapshot) => {
            let info = [];
            snapshot.docs.forEach((element) => {
                info.push({ ...element.data(), id: element.id });
            })
            const myList = info.filter((infito) => {
                return infito.id == id;
            })
            subDispatch({ type: actions.charge, payLoad: { listComments: JSON.parse(myList[0].listSubComments) } })
        })
    }, [])
    useEffect(() => {
        //localStorage.setItem(`listSubComents${id}`, JSON.stringify(listSubComents))
        if (listSubComents.length !== 0)
            setSubComment(id);
    }, [listSubComents])
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
                <IconEdit onClick={() => { setEdit(!edit); dispatch({ type: actions.upDate, payLoad: { id: id, upDatedComment: upDatedComment } }) }} />
                <button className="edit" onClick={() => { setEdit(!edit); dispatch({ type: actions.upDate, payLoad: { id: id, upDatedComment: upDatedComment } }) }}>{edit ? "Done" : "Edit"}</button>
            </div>
        }
        else {
            return <div className='elseFoot'>
                <IconReply onClick={HandleReply} />
                <button className="reply" onClick={HandleReply}>Reply</button>
            </div>
        }
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
    function handleSendComent() {
        setReply(false);
        setAppTime(Date.now());
        subDispatch({ type: actions.addComment, payLoad: { newComment: newComment, time: Date.now(), photo: auth.currentUser.photoURL, name: auth.currentUser.displayName, fatherId: id, uid: auth.currentUser.uid} })
        setNewComment("")
        setSubComment(id);
    }
    function setSubComment(id) {
        setDoc(doc(db, "messages", `${id}`),
            {
                listSubComments: JSON.stringify(listSubComents)
            });
    }
    function handlePlus() {
        dispatch({ type: actions.like, payLoad: { name: auth.currentUser.uid, id: id, setHasLiked: setHasLiked, hasLiked: hasLiked } })
    }
    function handleMinus() {
        dispatch({ type: actions.noLike, payLoad: { name: auth.currentUser.uid, id: id, setHasLiked: setHasLiked, hasLiked: hasLiked } })
    }
    return (
        <>
            <div className='CommentBox'>
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
                        <button className={peopleLike.length !== 0 ? liked ? "plus like" : "plus" : "plus"} onClick={() => { handlePlus() }}><IconPlus /></button>
                            <span className="numerLikes">{peopleLike ? peopleLike.length : 0}</span>
                        <button className={peopleNoLike.length !== 0 ? noLiked ? "minus like" : "plus" : "minus"} onClick={() => { handleMinus() }}><IconMinus /></button>
                    </div>
                    <div className="footSection">
                        {
                            handleShow()
                        }
                    </div>


                </div>
            </div>
            <div className='subComents'>
                {reply &&
                    <div className="inputBoxB">
                        <textarea type="text" required placeholder='Add a comment...' className='commentInputB' onChange={handleInput} value={newComment}></textarea>
                        <div className="secondRaw">
                            <img src={auth.currentUser.photoURL} alt="" className="user" />
                            <button className="send" onClick={handleSendComent}>SEND</button>
                        </div>
                    </div>
                }

                {
                    listSubComents.map((comentObj) => {
                        if (comentObj.fatherId === id) {
                            return <SubCommentBox key={comentObj.key} photo={comentObj.photo} name={comentObj.name} comment={comentObj.comment} mine={comentObj.uid === auth.currentUser.uid ? true : false} subDispatch={subDispatch} id={comentObj.key} setAppTime={setAppTime} ownTime={comentObj.ownTime} fatherId={id} peopleLike={comentObj.peopleLike} peopleNoLike={comentObj.peopleNoLike} />
                        }

                        else return null
                    })

                }
            </div>
            {showDeleteBox && <DeleteBox setShowDeleteBoxOff={setShowDeleteBox} id={id} dispatch={dispatch} father={true} />}
        </>
    )
}

export default CommentBox