import './styles/app.css';
import { useState, useReducer, useEffect, useRef } from "react";
import CommentBox from "./components/CommentBox.js";
import { AppTimeContext } from './Context';
import { CurrentUserContext } from './Context';
import LogIn from './components/LogIn';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  updateDoc
}from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import LogOut from './components/LogOut';
firebase.initializeApp(
  {
    apiKey: "AIzaSyAir6tvU8UVL47b_PJxV-FtKBxr15MprCo",
    authDomain: "commentsection-cf428.firebaseapp.com",
    projectId: "commentsection-cf428",
    storageBucket: "commentsection-cf428.appspot.com",
    messagingSenderId: "362824085852",
    appId: "1:362824085852:web:4f929a4569989bb5eb9199",
    measurementId: "G-FKDZ8G04BR"
  }
)
export const firestore = firebase.firestore();
export const actions = {
  addComment: "addComment",
  toggle: "toggle",
  delete: "delete",
  clear: "clear",
  upDate: "upDate",
  copy: "copy",
  charge: "charge",
  minLike: "minLike",
  sumLike: "sumLike"
}
export const db= getFirestore();
export const auth = firebase.auth();
function reducer(listComents, action) {
  switch (action.type) {
    case actions.addComment:
      {
        return [...listComents, createNewComment(action.payLoad.newComment, action.payLoad.photo, action.payLoad.time, action.payLoad.name, action.payLoad.uid,Date.now())]
      }     
    case actions.delete:
      {
        console.log("delete");
        return listComents.filter((comment) => { return comment.key !== action.payLoad.id })
      }
    case actions.upDate:
      return listComents.map((comentObj) => {
        if (comentObj.key === action.payLoad.id) {
          comentObj.comment = action.payLoad.upDatedComment;
        }
        return comentObj;
      })
    case actions.charge:
      return action.payLoad.listComments
    case actions.sumLike:
      {
        return listComents.map((comentObj) => {
          if (comentObj.key === action.payLoad.id) {
            comentObj.likes = action.payLoad.localLikes;
            console.log("sumo")
          }
          return comentObj;
        })
      }
    case actions.minLike:
      {
        return listComents.map((comentObj) => {
          if (comentObj.key === action.payLoad.id) {
            comentObj.likes = action.payLoad.localLikes;
            console.log("entro al likesmin")
          }
          return comentObj;
        })
      }
    default:
      return listComents;
  }
}
function createNewComment(newComment, photo, time, name, uid,key) {
  addSubcomments(key);
  return { key: key, photo: photo, name: name, time: time, comment: newComment, ownTime: Date.now(), likes: 0, uid: uid }
}
function addSubcomments(id)
  {
    /* addDoc(messagesCol,{
      listSubComments:""
  }); */
  setDoc(doc(db,"messages",`${id}`),
{
  listSubComments:""
});
  }
function App() {////////////////////////////////////////
  const dummy = useRef();
  const messagesCol=collection(db,'messages');
  const docRef=doc(db,'messages','oSUw9RAfj1P3FmUrlmkN');
  const listCommentsRef=firestore.collection('messages').doc('listComments');
 const messagesRef = firestore.collection('messages');
  const [user] = useAuthState(auth)
  const [newComment, setNewComment] = useState("");
  const [listComents, dispatch] = useReducer(reducer, []);
  const [appTime, setAppTime] = useState(Date.now());
  const [currentUser, setCurrentUser] = useState("")
  const [messages] = useCollectionData(messagesRef, { idField: 'id' });
  const listCommentsId="oSUw9RAfj1P3FmUrlmkN";
  useEffect(()=>
  {
    /* if(messages)
    {
      dispatch({ type: actions.charge, payLoad: { listComments: JSON.parse(messages.id("oSUw9RAfj1P3FmUrlmkN").listComments) } })

    } */
     getDocs(messagesCol).then((snapshot)=>{
       let info=[];
       snapshot.docs.forEach((element)=>{
         info.push({...element.data(),id:element.id});
       })
       const myList=info.filter((info)=>{
            return info.id===listCommentsId;
       }) 
  dispatch({ type: actions.charge, payLoad: { listComments: JSON.parse(myList[0].listComments) } })
    }) 
  },[])
  useEffect(() => {
    if(listComents.length!==0)
    {    
      sendMessage();
    }
  }, [listComents])
  function handleInput(e) {
    setNewComment(e.currentTarget.value);
  }
  function handleSendComent() {
    setAppTime(Date.now());
    dispatch({ type: actions.addComment, payLoad: { newComment: newComment, time: Date.now(), photo: auth.currentUser.photoURL, name: auth.currentUser.displayName, uid: auth.currentUser.uid } })
    setNewComment("")
    //addSubcomments();//cuando meto esto se laguea, por que?creo que debe ser que esta leyendo y escribiedo
  }
  function log(logi)
  {
    console.log(logi);
  }
function sendMessage()
{
  updateDoc(docRef,{
    listComments:JSON.stringify(listComents)
  })

}// el problema es que send message se ejecuta antes de poder actualizar el mensaje
  return (
    <AppTimeContext.Provider value={{ appTime, setAppTime }}>
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        {!user ? <LogIn /> :
          <div className="app">
            <header className='header'>
              <LogOut />
            </header>
            <div className="comments">
              {listComents&&
                listComents.map((comentObj) => {//sumo uid a mine
                  return <CommentBox key={comentObj.key} photo={comentObj.photo} name={comentObj.name} comment={comentObj.comment} mine={comentObj.uid === auth.currentUser.uid ? true : false} dispatch={dispatch} id={comentObj.key} setAppTime={setAppTime} ownTime={comentObj.ownTime} likes={comentObj.likes} />
                })
                
              }
              <div ref={dummy.current}></div>
            </div>
            <div className="inputBox">
              <textarea type="text" required placeholder='Add a comment...' className='comentInput' onChange={handleInput} value={newComment}></textarea>
              <div className="secondRaw">
                <img src={auth.currentUser.photoURL} alt="" className="user" />
                <button className="send" onClick={handleSendComent}>SEND</button>
              </div>
            </div>
          </div>
        }
      </CurrentUserContext.Provider>
    </AppTimeContext.Provider>
  );
}

export default App;
