import React from "react";
import cam from "../images/video.png";
import Messages from "./Messages";
import Input from "./Input";

const Chat = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-blue-400 overflow-x-hidden sm:w-2/3  lg:w-3/4 h-full">
      <div className="flex justify-between items-center bg-shadyblue w-full px-4 py-2">
        <div className="flex items-center flex-row">
          <img src="https://picsum.photos/200" alt="User profile" className="w-9 h-9 mr-3 rounded-full cursor-pointer "/>
          <span className="text-white font-bold text-2xl">John</span>
        </div>
        <div className="flex items-center">
          <img className="mr-3 w-10 h-10 cursor-pointer" src={cam} alt="video call"/>
          <img className="mr-3 w-10 h-10 cursor-pointer" src={cam} alt="video call"/>
          <img className="mr-3 w-10 h-10 cursor-pointer" src={cam} alt="video call"/>
        </div>
      </div>
      <div className="flex flex-col w-full max-h-full overflow-y-scroll ">
        <Messages />
      </div>
      <Input />
    </div>
  );
};

export default Chat;
