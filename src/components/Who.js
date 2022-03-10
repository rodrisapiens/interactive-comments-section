import React,{useContext,useState} from 'react'
import { CurrentUserContext } from '../Context'
function Who() {
    const{setCurrentUser}=useContext(CurrentUserContext);
    const[currentLocalUser,setCurrentLocalUser]=useState("");
  return (
    <div className='who'>
        <form onSubmit={()=>{setCurrentUser(currentLocalUser)}}>
        <input type="text" placeholder='who are you?' className="currentInput"required value={currentLocalUser}onChange={(e)=>setCurrentLocalUser(e.currentTarget.value)}/>
        </form>
    </div>
  )
}

export default Who