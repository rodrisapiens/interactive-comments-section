import React from 'react'
import 'firebase/compat/auth'
import { auth } from '../App'
function LogOut() {
    function logOut()
    {
        auth.signOut();
    }
  return (
      <button className='logOut'onClick={logOut}>Log out</button>
  )
}

export default LogOut