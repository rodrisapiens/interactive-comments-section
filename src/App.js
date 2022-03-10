import './styles/app.css';
import { useState, useReducer, useEffect } from "react";
import userImage from "./images/avatars/image-juliusomo.png";
import CommentBox from "./components/CommentBox.js";
import { AppTimeContext } from './Context';
import { CurrentUserContext } from './Context';
import Who from './components/Who';
export const actions = {
  addComment: "addComment",
  toggle: "toggle",
  delete: "delete",
  clear: "clear",
  upDate: "upDate",
  copy: "copy",
  charge:"charge",
  minLike:"minLike",
  sumLike:"sumLike"
}
function reducer(listComents, action) {
  switch (action.type) {
    case actions.addComment:
      {
        return [...listComents, createNewComment(action.payLoad.newComment, action.payLoad.photo, action.payLoad.time, action.payLoad.name)]
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
              comentObj.likes=action.payLoad.localLikes;
              console.log("sumo")
            }
            return comentObj;
          })
        }
        case actions.minLike:
        {
          return listComents.map((comentObj) => {
            if (comentObj.key === action.payLoad.id) {
              comentObj.likes=action.payLoad.localLikes;  
              console.log("entro al likesmin")
            }
            return comentObj;
          })
        }
    default:
      return listComents;
  }
}
function createNewComment(newComment, photo, time, name) {
  return { key: Date.now(), photo: photo, name: name, time: time, comment: newComment,ownTime:Date.now(),likes:0 }
}
function App() {////////////////////////////////////////7
  const [newComment, setNewComment] = useState("");
  const [listComents, dispatch] = useReducer(reducer, []);
  const [appTime, setAppTime] = useState(Date.now());
  const [mine,setMine]=useState(false);
  const[currentUser,setCurrentUser]=useState("")
  useEffect(() => {
    const data=localStorage.getItem("listComments");
    if(data)
    {
      dispatch({type:actions.charge,payLoad:{listComments:JSON.parse(data)}})
    }
  }, [])
  useEffect(() => {
  localStorage.setItem("listComments",JSON.stringify(listComents))
  }, [listComents])
  

  
  function handleInput(e) {
    setNewComment(e.currentTarget.value);
  }
  function handleSendComent() {
    setAppTime(Date.now());
    dispatch({ type: actions.addComment, payLoad: { newComment: newComment, time: Date.now(), photo: userImage, name: currentUser } })
    setNewComment("")
  }

  return (
    <AppTimeContext.Provider value={{ appTime, setAppTime }}>
      <CurrentUserContext.Provider value={{currentUser,setCurrentUser}}>
      {currentUser===""?<Who/>:
      <div className="app">
        <div className="comments">
          {
            listComents.map((comentObj) => {
              return <CommentBox key={comentObj.key} photo={comentObj.photo} name={comentObj.name} comment={comentObj.comment} mine={comentObj.name===currentUser?true:false} dispatch={dispatch} id={comentObj.key} setAppTime={setAppTime}ownTime={comentObj.ownTime}likes={comentObj.likes}/>
            })
          }
        </div>
        <div className="inputBox">
          <textarea type="text" required placeholder='Add a comment...' className='comentInput' onChange={handleInput} value={newComment}></textarea>
          <div className="secondRaw">
            <img src={userImage} alt="" className="user" />
            <button className="send" onClick={handleSendComent}>SEND</button>
          </div>
        </div>
        <button className="reply"onClick={()=>{setMine(!mine)}}>MINE</button>
      </div>
      }
      </CurrentUserContext.Provider>
    </AppTimeContext.Provider>
  );
}

export default App;
