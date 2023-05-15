import React, { useContext } from "react";
import cam from "../images/cam.png";
import add from "../images/add.png";
import more from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return data.chatId != "null" ? (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-shadywhite overflow-x-hidden sm:w-2/3 lg:w-3/4 h-full">
      <div className="flex justify-between items-center bg-shadyblue w-full px-4 py-3">
        <div className="flex items-center flex-row">
          <img
            src={data.user?.photoURL}
            alt="User profile"
            className="w-10 h-10 mr-3 rounded-full cursor-pointer "
          />
          <span className="text-white font-bold text-2xl">
            {data.user?.displayName}
          </span>
        </div>
        <div className="flex items-center">
          <img
            className="mr-3 w-10 h-10 cursor-pointer"
            src={cam}
            alt="video call"
          />
          <img
            className="mr-3 w-10 h-10 cursor-pointer"
            src={add}
            alt="video call"
          />
          <img
            className="mr-3 w-10 h-10 cursor-pointer"
            src={more}
            alt="video call"
          />
        </div>
      </div>
      <div className="flex flex-col w-full overflow-y-scroll bg-shadywhite max-h-[calc(100vh-6.5rem)]">
        <Messages />
      </div>
      <Input />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen w-full font-bold justify-center items-center text-3xl bg-shadywhite overflow-x-hidden sm:w-2/3 lg:w-3/4 h-full">
      Welcome to VChat
      <div className="text-lg font-normal">
        Send and receive texts without any external app.
      </div>
    </div>
  );
};

export default Chat;
