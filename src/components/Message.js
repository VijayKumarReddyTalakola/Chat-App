import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import avatar from "../images/avatar.png";


const Message = ({ message }) => {
  const [selected, setselected] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  const getTimeFromTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return format(date, "h:mm a");
  };

  const openFullScreen = () => {
    document.getElementById(`${message.id}`)?.requestFullscreen();
  };

  const updateLastMessage = (message,document)=>{
    const documentData = document.data();
    const fieldIds = Object.keys(document.data());
    fieldIds.forEach(async (fieldId) => {
      if(fieldId === data.chatId){
        const lastMessageData = documentData[fieldId].lastMessage;
        if (lastMessageData?.id === message.id) {
          const updatedLastMessage = {
            [`${fieldId}.lastMessage.id`]: message.id,
            [`${fieldId}.lastMessage.deleted`]: true,
            [`${fieldId}.lastMessage.text`]: deleteField(),
            [`${fieldId}.lastMessage.img`]: deleteField(),
          };
          await updateDoc(doc(db, "userChats", document.id), updatedLastMessage);
        }
      }
    });
  }

  const deleteMessage = async (message) => {
    if(message.senderId === currentUser.uid){
      const chatDocRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (chatDoc.exists()) {
        const messages = chatDoc.data().messages;
        const updatedMessages = messages.filter((msg) => msg.id !== message.id);
        await updateDoc(chatDocRef, { messages: updatedMessages });

        const userChatsDocRef = doc(db, "userChats", currentUser.uid);
        const userChatsDoc = await getDoc(userChatsDocRef);
        updateLastMessage(message, userChatsDoc)

        const otherUserChatsDocRef = doc(db, "userChats", data.user.uid);
        const otherUserChatsDoc = await getDoc(otherUserChatsDocRef);
        updateLastMessage(message, otherUserChatsDoc)
      }
    }
  };


  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse ">
          <div onClick={() => setselected(!selected)}  className="flex flex-row-reverse w-[90%] lg:max-w-[75%]">
          <img
            src={currentUser?.photoURL}
            alt={avatar}
            onClick={openFullScreen}
            className=" w-10 h-10 rounded-full"
          />
          {/* Only text */}
          {message.text && !message.img && (
            <div className=" flex flex-col my-2 justify-items-end">
              <div className="flex justify-items-end items-center bg-blue-400 px-3 py-1 ml-auto mr-2 rounded-b-lg rounded-tr-none rounded-tl-lg">
                <p className="flex text-white break-words">{message.text}</p>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500 mr-2">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* only Image */}
          {message.img && !message.text && (
            <div className="flex flex-col my-2 justify-items-end">
              <div className="flex flex-col justify-items-end bg-blue-400 p-1 m-1 rounded">
                <img
                  id={`${message.id}`}
                  src={message.img}
                  onDoubleClick={openFullScreen}
                  alt="Message"
                  className="w-60 h-64 rounded-md cursor-pointer"
                />
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* Both text and image */}
          {message.img && message.text && (
            <div className="flex flex-col my-2">
              <div className="flex flex-col bg-blue-400 p-1 m-1 rounded">
                <img
                  id={`${message.id}`}
                  src={message.img}
                  onDoubleClick={openFullScreen}
                  alt="Message"
                  className="w-60 h-64 m-0.5 rounded-md cursor-pointer"
                />
                <p className="flex justify-start flex-wrap break-all bg-blue-400 w-60 mr-auto text-white p-1 rounded-b-lg rounded-tr-none rounded-tl-lg">
                  {message.text}
                </p>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {selected && (
            <MdDelete
              className=" text-blue-500 mr-1 mt-3 cursor-pointer"
              onClick={() => deleteMessage(message)}
            />
          )}
          </div>
        </div>
      ) : (
        <div ref={ref} className="flex flex-row w-[90%] lg:max-w-[75%]">
          <img
            src={data.user?.photoURL}
            alt={avatar}
            className="w-10 h-10 rounded-full"
          />
          {/* Only text */}
          {message.text && !message.img && (
            <div className="flex flex-col my-2" >
              <div className="flex justify-end bg-white ml-2 mr-auto px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg">
                <p className="text-black break-words">{message.text}</p>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* only Image */}
          {message.img && !message.text && (
            <div className="flex flex-col">
              <div className="flex justify-items-end bg-white p-1 m-2 rounded">
                <img
                  id={`${message.id}`}
                  src={message.img}
                  onDoubleClick={openFullScreen}
                  alt="Message"
                  className="w-60 h-64 rounded-md cursor-pointer"
                />
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* Both text and image */}
          {message.img && message.text && (
            <div className="flex flex-col">
              <div className="flex flex-col justify-items-end bg-white p-2 m-2 rounded ">
                <img
                  id={`${message.id}`}
                  src={message.img}
                  onDoubleClick={openFullScreen}
                  alt="Message"
                  className="w-60 h-64 m-0.5 rounded-md cursor-pointer"
                />
                <p className="flex justify-start break-all bg-white w-60 mr-auto text-black p-1 rounded-b-lg rounded-tl-none rounded-tr-lg ">
                  {message.text}
                </p>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Message;
