import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext)
  const {dispatch} = useContext(ChatContext)
  useEffect(() => {
    const getChats = ()=>{
      const unsub = onSnapshot(doc(db,'userChats',currentUser.uid),(doc)=>{
        setChats(doc.data())
      })
    }
    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = (user) =>{
    dispatch({type:'CHANGE_USER',payload:user})
  }
  return (
    <ul className="w-screen flex flex-col justify-start items-start relative  h-full m:w-1/3 lg:w-1/4">
    {
       Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map(chat =>(
        <li 
        onClick={()=>handleSelect(chat[1].userInfo)} 
        key={chat[0]} className="flex items-center  mx-3 p-2 hover:bg-regal-blue rounded-md w-screen">
          <img src={chat[1].userInfo.photoURL} alt="Vijay's profile" className="w-12 h-12 mr-4 rounded-full cursor-pointer"/>
          <div className="flex flex-col">
            <span className="font-bold text-white">{chat[1].userInfo.displayName}</span>
            <p className="text-gray-300">{chat[1].lastMessage?.text} </p>
          </div>
        </li>
      ))
    }
    </ul>
  );
};

export default Chats;

