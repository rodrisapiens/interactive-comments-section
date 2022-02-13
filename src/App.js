import './styles/app.css';
import { useState } from "react";
import userImage from "./images/avatars/image-juliusomo.png";
function App() {
  const [comment, setComment] = useState("");
  function handleInput(e) {
    setComment(e.currentTarget.value);
  }
  return (
    <div className="App">
      <div className="inputBox">
        <input type="text" required placeholder='Add a comment...' className='comentInput' onChange={handleInput} value={comment}></input>
        <div className="secondRaw">
          <img src={userImage} alt="" className="user" />
          <button className="send">SEND</button>
        </div>
      </div>
    </div>
  );
}

export default App;
