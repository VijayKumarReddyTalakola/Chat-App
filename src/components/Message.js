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
  };


  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse w-full ">
          <img
            src={currentUser?.photoURL}
            alt={avatar}
            onClick={openFullScreen}
            className="w-10 h-10 rounded-full"
          />
          {/* Only text */}
          {message.text && !message.img && (
            <div onClick={() => setselected(!selected)} className="relative flex flex-col my-2 justify-items-end ">
              <div className=" flex justify-start bg-blue-400 ml-auto mr-2 text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg">
                <div className=" max-w-[90vw] md:max-w-[75%] flex justify-around items-center">
                  <p className="flex justify-end bg-blue-400 ml-auto text-white rounded-b-lg rounded-tr-none rounded-tl-lg">
                    {message.text}
                  </p>
                  {selected && (
                    <MdDelete
                      className=" text-white ml-3 border-2 border-red-700 cursor-pointer"
                      onClick={() => deleteMessage(message)}
                    />
                  )}
                </div>
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
                  className="h-56 w-48 rounded-md sm:w-56 sm:h-64 cursor-pointer"
                />
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* Both text and image */}
          {message.img && message.text && (
            <>
              <div className="flex flex-col my-2">
                <div className="flex flex-col bg-blue-400 p-1 m-1 rounded">
                  <img
                    id={`${message.id}`}
                    src={message.img}
                    onDoubleClick={openFullScreen}
                    alt="Message"
                    className="h-56 w-48 m-0.5 rounded-md sm:w-56 sm:h-64 cursor-pointer"
                  />
                  <p className="flex justify-start bg-blue-400 w-48 mr-auto ml-1 text-white p-1 rounded-b-lg rounded-tr-none rounded-tl-lg sm:w-56">
                    {message.text}
                  </p>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div ref={ref} className="flex flex-row w-full">
          <img
            src={data.user?.photoURL}
            alt={avatar}
            className="w-10 h-10 rounded-full"
          />
          {/* Only text */}
          {message.text && !message.img && (
            <div className="flex flex-col my-2 max-w-[90vw] md:max-w-[75%]">
              <p className="flex justify-start bg-white ml-2 mr-auto text-black px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg">
                {message.text}
              </p>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* only Image */}
          {message.img && !message.text && (
            <>
              <div className="flex flex-col">
                <div className="flex justify-items-end bg-white p-1 m-2 rounded">
                  <img
                    id={`${message.id}`}
                    src={message.img}
                    onClick={openFullScreen}
                    alt="Message"
                    className="h-56 w-48 rounded-md sm:w-56 sm:h-64 cursor-pointer"
                  />
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            </>
          )}
          {/* Both text and image */}
          {message.img && message.text && (
            <>
              <div className="flex flex-col">
                <div className="flex flex-col justify-items-end bg-white p-1 m-2 rounded">
                  <img
                    id={`${message.id}`}
                    src={message.img}
                    onClick={openFullScreen}
                    alt="Message"
                    className="h-56 w-48 m-0.5 rounded-md sm:w-56 sm:h-64 cursor-pointer"
                  />
                  <p className="flex justify-start bg-white w-48 ml-1 mr-auto text-black p-1 rounded-b-lg rounded-tl-none rounded-tr-lg sm:w-56">
                    {message.text}
                  </p>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Message;
