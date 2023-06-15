import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";
import { MdDelete, MdBlock } from "react-icons/md";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
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

  const deleteMessage = async (message) => {
    const batch = writeBatch(db);
    const chatDocRef = doc(db, "chats", data.chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (chatDoc.exists()) {
      const messages = chatDoc.data().messages;
      const updatedMessages = messages.map((msg) => {
        if (msg.id === message.id) {
          const updatedMsg = { ...msg, deleted: true };
          delete updatedMsg.text;
          delete updatedMsg.img;
          return updatedMsg;
        }
        return msg;
      });

      const lastMessageIndex = updatedMessages.length - 1;
      const lastMessage = updatedMessages[lastMessageIndex];
      await updateDoc(chatDocRef, { messages: updatedMessages });

      const userChatsDocRef = doc(db, "userChats", data.chatId);
      const userChatsDoc = await getDoc(userChatsDocRef);
      const userChatsData = userChatsDoc.data();
      console.log(userChatsData);
      if (userChatsData.id === data.chatId) {
        const lastMessageInMyChat = userChatsData.lastMessage;
        if (
          lastMessageInMyChat &&
          lastMessageInMyChat.id === message.id &&
          lastMessageInMyChat === lastMessage
        ) {
          const updatedLastMessage = { ...lastMessageInMyChat, deleted: true };
          delete updatedLastMessage.text;
          delete updatedLastMessage.img;
          batch.update(userChatsDocRef, {
            [`${data.chatId}.lastMessage`]: updatedLastMessage,
          });
        }
      }

      const otherUserChatsDocRef = doc(db, "userChats", data.chatId);
      const otherUserChatsDoc = await getDoc(otherUserChatsDocRef);
      const otherUserChatsData = otherUserChatsDoc.data();
      console.log(otherUserChatsData);
      if (otherUserChatsData.id === data.chatId) {
        const lastMessageInOtherChat = otherUserChatsData.lastMessage;
        if ( lastMessageInOtherChat && lastMessageInOtherChat.id === message.id && lastMessageInOtherChat === lastMessage) {
          const updatedLastMessage = {
            ...lastMessageInOtherChat,
            deleted: true,
          };
          delete updatedLastMessage.text;
          delete updatedLastMessage.img;
          batch.update(otherUserChatsDocRef, {
            [`${data.chatId}.lastMessage`]: updatedLastMessage,
          });
        }
      }

      await batch.commit();
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
            <div
              onClick={() => setselected(!selected)}
              className="flex flex-col my-2 justify-items-end max-w-[50%] "
            >
              <div className="flex justify-start bg-blue-400 ml-auto mr-2 text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg">
                <div className="flex justify-around items-center">
                  {message.deleted ? (
                    <div className="flex ">
                      <MdBlock className="text-gray-500 mr-2" />
                      <p className="text-center text-gray-500">
                        This message is deleted.
                      </p>
                    </div>
                  ) : (
                    message.text
                  )}
                  {selected && (
                    <MdDelete
                      className=" text-white ml-3 cursor-pointer"
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
                  alt="Image"
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
                    alt="Image"
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
            <div className="flex flex-col my-2 max-w-[50%]">
              <p className="flex justify-end bg-white ml-2 mr-auto text-black px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg">
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
                    alt="Image"
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
                    alt="Image"
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
