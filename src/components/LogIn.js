import React,{useContext,useState} from 'react'
import { CurrentUserContext } from '../Context'
import {ReactComponent as Google} from "../images/google.svg";
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { auth } from '../App'
function LogIn() {
  function signInWithGoogle()
  {
      const provider= new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return (
    <button className='logIn'onClick={signInWithGoogle}><Google className='google'/>Log in with google</button>
  )
}

export default LogIn