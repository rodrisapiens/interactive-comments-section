import './styles/app.css';
import { useState,useReducer ,useEffect} from "react";
import userImage from "./images/avatars/image-juliusomo.png";
import CommentBox from "./components/CommentBox.js";
import { AppTimeContext } from './Context';
export const actions = {
  addComment: "addComment",
  toggle: "toggle",
  delete: "delete",
  clear: "clear",
  copy:"copy"
}
function reducer(listComents, action) {
  switch (action.type) {
    case actions.addComment:
      {  
        return [...listComents, createNewComment(action.payLoad.newComment,action.payLoad.photo,action.payLoad.time,action.payLoad.name)]
      }
      case actions.delete:
        {
          console.log("delete");
          return listComents.filter((comment)=>{return comment.key!==action.payLoad.id})
        }
      default:
        return listComents;
  }
}
function createNewComment(newComment,photo,time,name)
{
  return {key:Date.now(),photo:photo,name:name,time:time,comment:newComment}
}
function App() {////////////////////////////////////////7
  const [newComment, setNewComment] = useState("");
  const [listComents, dispatch] = useReducer(reducer, []);
  const [appTime,setAppTime]=useState(Date.now());
  const [sent,setSent]=useState(false);
  function handleInput(e) {
    setNewComment(e.currentTarget.value);
  }
  function handleSendComent()
  { 
    setAppTime(Date.now());
    dispatch({type:actions.addComment,payLoad:{newComment:newComment,time:Date.now(),photo:userImage,name:"juliusomo"}})
    setNewComment("")
  }
  
  return (
    <AppTimeContext.Provider value={{appTime,setAppTime}}>
    <div className="app">
      <div className="comments">
      {
        listComents.map((comentObj)=>
        {
          return <CommentBox key={comentObj.key}photo={comentObj.photo}name={comentObj.name}comment={comentObj.comment} mine={true} dispatch={dispatch}id={comentObj.key}/>
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
    </div>
    </AppTimeContext.Provider>
  );
}

export default App;
