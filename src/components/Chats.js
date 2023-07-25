import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format, isToday, isYesterday } from "date-fns";
import { MdBlock, MdPhoto } from "react-icons/md";
import avatar from "../images/avatar.png";


const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => unsub();
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

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
    } else {
      const formattedDate = format(date, "d/MM/yy");
      return formattedDate;
    }
  };

  const renderLastMessage = (lastMessage) => {
    if (lastMessage) {
      if (lastMessage.deleted) {
        return (
          <div className="flex items-center">
            <MdBlock className="text-gray-300" />
            <p className="text-gray-300 ml-1 md:text-xs xl:text-base">This Message was deleted</p>
          </div>
        );
      } else {
        if (lastMessage.text && !lastMessage.img) {
          return (
            <p className="text-gray-300">
              {truncateMessage(lastMessage.text, 25)}
            </p>
          );
        } else if (lastMessage.img && !lastMessage.text) {
          return (
            <div className="flex items-center">
              <MdPhoto className="bg-transparent text-white" />
              <p className="text-gray-300 ml-1">Photo</p>
            </div>
          );
        } else if (lastMessage.img && lastMessage.text) {
          return (
            <div className="flex items-center">
              <MdPhoto className="bg-transparent text-white" />
              <p className="text-gray-300 ml-1">
                {truncateMessage(lastMessage.text, 25)}
              </p>
            </div>
          );
        }
      }
    }
    return null;
  };

  const truncateUserName = (userName) => {
    if (userName.length <= 15) {
      return userName;
    }
    return userName.substring(0, 15) + "...";
  };


  const truncateMessage = (message, maxLength) => {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + "...";
  };

  return (
    <ul className="w-full flex flex-col justify-start items-start relative h-full overflow-y-scroll ">
      {chats &&
        Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <li
              onClick={() => handleSelect(chat[1].userInfo)}
              key={chat[0]}
              className="flex items-center p-2 hover:bg-regal-blue hover:cursor-pointer rounded-md w-full "
            >
              <div className="flex items-center w-full">
                <div className="w-fit">
                  <img
                    src={chat[1].userInfo?.photoURL}
                    alt={avatar}
                    className="w-12 h-12 mr-3 rounded-full md:mr-2 md:w-10 md:h-10 lg:mr-2 xl:w-12 xl:h-12 "
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between ">
                    <span className="font-bold text-white text-lg md:font-medium lg:text-base xl:text-lg">
                      { chat[1].userInfo?.uid === currentUser.uid ? (truncateUserName(chat[1].userInfo?.displayName))+' (You)' : truncateUserName(chat[1].userInfo?.displayName)} 
                    </span>
                    <span className="text-gray-300 md:text-sm flex justify-items-end">
                      {getTimeOrDateFromTimestamp(chat[1].date)}
                    </span>
                  </div>
                  {chat[1].lastMessage && (
                    <div className="flex flex-row ">
                      <span className="text-gray-300 md:text-sm xl:text-base">
                        {renderLastMessage(chat[1].lastMessage)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
    </ul>
  );
};
export default Chats;
