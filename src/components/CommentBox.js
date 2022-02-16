import React, { useState, useEffect, useContext } from 'react'
import { ReactComponent as IconPlus } from "../images/icon-plus.svg";
import { ReactComponent as IconMinus } from "../images/icon-minus.svg";
import { ReactComponent as IconReply } from "../images/icon-reply.svg";
import { ReactComponent as IconDelete } from "../images/icon-delete.svg";
import { ReactComponent as IconEdit } from "../images/icon-edit.svg";
import { AppTimeContext } from '../Context';
import "../styles/commentBox.css";



function CommentBox({ name, comment, photo, time, mine,sent }) {
    const [likes, setLikes] = useState(0);
    const [ownTime, setOwnTime] = useState(Date.now());
    const [timeAgo, setTimeAgo] = useState(0);
    const {appTime,setAppTime}=useContext(AppTimeContext)
    useEffect(() => {
        setOwnTime(Date.now())
    }, [])
    function ShowTimeAgo() {
        let seconds = Math.round(timeAgo / 1000);
        console.log("time passed:",seconds)
        let response;
        if (seconds < 1) {
            response = "now";
        }
        if (seconds > 1) {
            response = seconds+" seconds ago"
        }
        if (seconds > 60) {
            if(Math.round(seconds / 60)>1){
                response = Math.round(seconds / 60) +" minutes ago"
            }
else{
    response = Math.round(seconds / 60) +" minute ago"

}
        }
        if(seconds>3600){
            if(Math.round(seconds/3600)>1)
            {
                response=Math.round(seconds/3600)+" hours ago"
            }
            else
            {
                response=Math.round(seconds/3600)+" hour ago"
            }
        }
        return(response);
    }
    useEffect(() => {
        setTimeAgo(appTime - ownTime)
        console.log("soy",comment,"se ejecuta effect cuando time cambbia")
    }, [appTime])

    function handleShow() {
        if (mine) {
            return <div className='myFoot'>
                <IconDelete />
                <button className="delete">Delete</button>
                <IconEdit />
                <button className="edit">Edit</button>
            </div>
        }
        else {
            return <div className='elseFoot'>
                <IconReply />
                <button className="reply">Reply</button>
            </div>
        }
    }
    return (
        <div className='CommentBox'>
            <div className="firstColumn">
                <img src={photo} alt="" className="thumnail" />
                <p className="name">{name}</p>
                <p className="you">{mine ? "you" : ""}</p>
                <p className="time">{ShowTimeAgo()}</p>
            </div>
            <p className="comment">{comment}</p>
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
    )
}

export default CommentBox