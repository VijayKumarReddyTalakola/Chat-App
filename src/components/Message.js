import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";
// import { MdDelete } from "react-icons/md";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase";

const Message = ({ message  }) => {
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

  const openFullScreen = ()=>{
    document.getElementById(`${message.id}`)?.requestFullscreen()
  }

  // const deleteMessage = async (message) => {
  //   const chatDocRef = doc(db, "chats", data.chatId);
  //   await updateDoc(chatDocRef, {
  //     ...message,
  //     [`messages.${message.id}.text`]: "",
  //     [`messages.${message.id}.img`]: null,
  //     [`messages.${message.id}.deleted`]: true,
  //   });
  // };


  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse w-full ">
          <img src={currentUser?.photoURL} alt="User profile" className="w-10 h-10 rounded-full"/>
          {message.text && !message.img && (
            <div className="flex flex-col my-2 justify-items-end max-w-[50%] hover:cursor-pointer">
              <p onDoubleClick={()=>setselected(!selected)} className="flex justify-start bg-blue-400 ml-auto mr-2 text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg">
                <div className="flex justify-around items-center">
                  {message.text}
                {/* { message.deleted ? "This message is deleted" :  message.text }   */}
                {/* {selected && <MdDelete className=" text-white ml-3 cursor-pointer" onClick={()=>deleteMessage(message)} />} */}
                </div>
              </p>
              <span className="flex text-xs justify-end my-1 text-gray-500 mr-2">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {message.img && !message.text && (
            <div className="flex flex-col my-2 justify-items-end">
              <div className="flex flex-col justify-items-end bg-blue-400 p-1 m-1 rounded">
                <img id={`${message.id}`} src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 rounded-md sm:w-56 sm:h-64 cursor-pointer"/>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {message.img && message.text && (
            <>
              <div className="flex flex-col my-2">
                <div className="flex flex-col bg-blue-400 p-1 m-1 rounded">
                  <img id={`${message.id}`} src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 m-0.5 rounded-md sm:w-56 sm:h-64 cursor-pointer"/>
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
          <img src={data.user?.photoURL} alt="User profile" className="w-10 h-10 rounded-full"/>
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
          {message.img && !message.text && (
            <>
              <div className="flex flex-col">
                <div className="flex justify-items-end bg-white p-1 m-2 rounded">
                  <img id={`${message.id}`} src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 rounded-md sm:w-56 sm:h-64 cursor-pointer"/>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            </>
          )}
          {message.img && message.text && (
            <>
              <div className="flex flex-col">
                <div className="flex flex-col justify-items-end bg-white p-1 m-2 rounded">
                  <img id={`${message.id}`} src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 m-0.5 rounded-md sm:w-56 sm:h-64 cursor-pointer"/>
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







