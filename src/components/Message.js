import React, { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";

const Message = ({ message }) => {
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
    document.getElementById('image')?.requestFullscreen()
  }

  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse">
          <img src={currentUser?.photoURL} alt="User profile" className="w-10 h-10 rounded-full"/>
          {message.text && (
            <div className="flex flex-col my-2 justify-items-end">
              <p className="flex justify-start bg-blue-400 max-w-fit ml-auto mr-2 text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg">
                {message.text}
              </p>
              <span className="flex text-xs justify-end  my-1 text-gray-500 mr-2">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {message.img && (
            <div className="flex flex-col my-2 justify-items-end">
              <div className="flex flex-col justify-items-end bg-blue-300 p-1 m-2">
                <img id="image" src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 rounded-md sm:w-48 sm:h-64 cursor-pointer"/>
              </div>
              {message.img && (
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row">
          <div className="flex flex-col">
            <img src={data.user?.photoURL} alt="User profile" className="w-10 h-10 rounded-full"/>
          </div>
          <div className="flex flex-col my-2 justify-items-end">
            {message.text && (
              <div className="flex flex-col">
                <p className="flex justify-end bg-white max-w-fit ml-2 mr-auto text-black px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg">
                  {message.text}
                </p>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            )}
            {message.img && (
              <div className="flex flex-col justify-items-end bg-gray-400 p-1 m-2">
                <img id="image" src={message.img} onClick={openFullScreen} alt="User profile" className="h-56 w-48 rounded-md md:w-48 md:h-64 cursor-pointer"/>
              </div>
            )}
            {message.img && (
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;







