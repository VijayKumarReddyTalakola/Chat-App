import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { HiOutlinePhotograph } from "react-icons/hi";
import { format, isToday, isYesterday } from "date-fns";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = ()=>{
      const unsub = onSnapshot(doc(db,'userChats',currentUser.uid),(doc)=>{
        setChats(doc.data())
      })
      return () => unsub();
    }
    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = (user) =>{
    dispatch({type:'CHANGE_USER',payload:user})
  }

  const getTimeOrDateFromTimestamp = (timestamp) => {
     if (!timestamp) {
       return "";
     }
    const date = timestamp.toDate();
    if (isToday(date)) {
      const time = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return time;
    } else if (isYesterday(date)) {
      return "Yesterday";
    }else {
      const formattedDate = format(date, "d/MM/yy");
      return formattedDate;
    }
  };
  
  const renderLastMessage = (lastMessage) => {
    if(lastMessage){
    if (lastMessage.text && !lastMessage.img) {
      return <p className="text-gray-300">{truncateMessage(lastMessage.text, 15)}</p>;
    } else if (lastMessage.img && !lastMessage.text) {
      return (
        <div className="flex items-center">
          <HiOutlinePhotograph className="bg-transparent text-white" />
          <p className="text-gray-300 ml-1">Photo</p>
        </div>
      );
    } else if (lastMessage.img && lastMessage.text) {
      return (
        <div className="flex items-center">
          <HiOutlinePhotograph className="bg-transparent text-white" />
          <p className="text-gray-300 ml-1">{truncateMessage(lastMessage.text, 15)}</p>
        </div>
      );
    }
    }
    return null;
  };

  const truncateMessage = (message, maxLength) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + '...';
  };

  return ( 
    <ul className="w-full flex flex-col justify-start items-start relative h-full ">
    {
        chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map(chat =>(
        <li 
        onClick={()=>handleSelect(chat[1].userInfo)} 
        key={chat[0]} className="flex items-center justify-between  p-3 hover:bg-regal-blue hover:cursor-pointer rounded-md w-full ">
          <div className="flex flex-row justify-between">
            <img src={chat[1].userInfo.photoURL} alt="Vijay's profile" className="w-12 h-12 mr-4 rounded-full "/>
            <div className="flex flex-col">
              <span className="font-bold text-white">{chat[1].userInfo.displayName}</span>
                {renderLastMessage(chat[1].lastMessage)}
            </div>
          </div> 
           {chat[1].lastMessage &&
            <div className="flex flex-row justify-end items-end">
              <span className="text-gray-300">{getTimeOrDateFromTimestamp(chat[1].date)}</span>
            </div>} 
        </li>
      ))
    }
    </ul>
  );
}
export default Chats;

