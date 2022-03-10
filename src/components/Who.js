import React,{useContext,useState} from 'react'
import { CurrentUserContext } from '../Context'
function Who() {
    const{setCurrentUser}=useContext(CurrentUserContext);
    const[currentLocalUser,setCurrentLocalUser]=useState("");
  return (
    <div className='who'>
        <h1 className="login">hi! submit a name, comment and then refresh to enter with another name.</h1>
        <form onSubmit={()=>{setCurrentUser(currentLocalUser)}}>
        <input type="text" placeholder='Who are you?' className="currentInput"required value={currentLocalUser}onChange={(e)=>setCurrentLocalUser(e.currentTarget.value)}/>
        </form>
    </div>
  )
}

export default Who