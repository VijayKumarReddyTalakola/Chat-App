import React from "react";
import cam from "../images/video.png";

const Chat = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-400 overflow-x-hidden md:w-3/4">
      <div className="flex justify-between items-center bg-shadyblue w-full px-4 py-2">
        <div className="flex items-center">
          <span className="text-white font-bold text-2xl">John</span>
        </div>
        <div className="flex items-center">
          <img className="mr-3 w-10 h-10" src={cam} alt="video call" />
          <img className="mr-3 w-10 h-10" src={cam} alt="video call" />
          <img className="mr-3 w-10 h-10" src={cam} alt="video call" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
