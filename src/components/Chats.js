import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format, isToday, isYesterday } from "date-fns";
import { MdBlock, MdPhoto } from "react-icons/md";
import avatar from "../images/avatar.png";
import { IoMdDocument } from "react-icons/io";

const Chats = () => {
  const validImageExtensions = [ "jpg", "jpeg", "png", "gif", "webp", "tiff", "bmp" ];
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
            <p className="text-gray-300 ml-1 md:text-xs xl:text-base flex-1">
              Last message was deleted
            </p>
          </div>
        );
      } else {
        const isImage = validImageExtensions.some((ext) =>
          lastMessage?.file?.toLowerCase().endsWith(ext)
        );
        if (lastMessage.text && !lastMessage.file) {
          // only text
          return <p className="text-gray-300 truncate">{lastMessage.text}</p>;
        } else if (lastMessage.file && !lastMessage.text && isImage) {
          // only image
          return (
            <div className="flex items-center truncate">
              <MdPhoto className="bg-transparent" />
              <p className="text-gray-300 ml-1 truncate flex-1">
                {lastMessage.file}
              </p>
            </div>
          );
        } else if (lastMessage.file && !lastMessage.text && !isImage) {
          // only file except image
          return (
            <div className="flex items-center truncate ">
              <IoMdDocument className="bg-transparent text-white" />
              <p className="text-gray-300 ml-1 truncate flex-1">
                {lastMessage.file}
              </p>
            </div>
          );
        } else if (lastMessage.file && lastMessage.text && isImage) {
          // both image and text
          return (
            <div className="flex items-center truncate">
              <MdPhoto className="bg-transparent text-white" />
              <p className="text-gray-300 ml-1 truncate flex-1">
                {lastMessage.text}
              </p>
            </div>
          );
        } else if (lastMessage.file && lastMessage.text && !isImage) {
          // both file and text
          return (
            <div className="flex items-center truncate ">
              <IoMdDocument className="bg-transparent text-white" />
              <p className="text-gray-300 ml-1 truncate flex-1">
                {lastMessage.text}
              </p>
            </div>
          );
        }
      }
    }
    return null;
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
              <div className="flex items-center gap-x-2 w-full h-full">
                <div className="w-fit mx-auto">
                  <img
                    src={chat[1].userInfo?.photoURL || avatar}
                    alt={avatar}
                    className="w-12 h-12 rounded-full md:w-10 md:h-10 xl:w-12 xl:h-12 "
                  />
                </div>
                <div className="flex flex-col gap-y-1 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between ">
                    <span className="font-bold text-white text-lg md:font-medium lg:text-base xl:text-lg truncate">
                      {chat[1].userInfo?.uid === currentUser.uid
                        ? chat[1].userInfo?.displayName + " (You)"
                        : chat[1].userInfo?.displayName}
                    </span>
                    <span className="text-gray-300 md:text-sm flex justify-items-end">
                      {getTimeOrDateFromTimestamp(chat[1].date)}
                    </span>
                  </div>
                  {chat[1].lastMessage && (
                    <span className="flex w-full text-gray-300 md:text-sm xl:text-base truncate">
                      {renderLastMessage(chat[1].lastMessage)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
    </ul>
  );
};
export default Chats;
