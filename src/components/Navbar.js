import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../firebase";
import {AuthContext} from '../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  const openFullScreen = () => {
    document.getElementById("dp")?.requestFullscreen();
  };
  return (
    <header className="top-0 left-0 sm:w-1/3 lg:w-1/4  inset-x-0 shadow-lg z-50 bg-regal-blue flex items-center justify-between p-3 gap-2 ">
      <div className="flex">
        <h1 className="text-white font-medium text-2xl top-0 left-0 ml-0">VChat</h1>
      </div>
      <ul className="flex flex-row justify-center items-center">
        <li><img src={currentUser.photoURL} onClick={openFullScreen} alt="User profile" id="dp" className="w-9 h-9 mx-3 rounded-full cursor-pointer sm:w-12 sm:h-12"/></li>
        <li><span className="font-bold text-white mt-2 sm:text-2xL lg:text-2xl lg:font-normal">{currentUser.displayName}</span></li>
        <li><button onClick={()=>signOut(auth)} className="text-3xs text-white cursor-pointer  ml-4 sm:text-xs">Logout</button></li>
      </ul>
    </header>
  );
};

export default Navbar;
