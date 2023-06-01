import React, { useContext } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const { data } = useContext(ChatContext);

  return data.chatId === "null" ? (
    <div className="flex flex-col justify-start min-h-screen bg-darkblue overflow-x-hidden h-full max-h-screen sm:w-1/3 lg:w-1/4">
      <div className="sticky top-0 w-screen z-50">
        <Navbar />
        <Search />
      </div>
      <Chats />
    </div>
  ) : (
    <div className="hidden sm:flex flex-col justify-start min-h-screen bg-darkblue overflow-x-hidden h-full max-h-screen sm:w-1/3 lg:w-1/4">
      <div className="sticky top-0 w-screen z-50">
        <Navbar />
        <Search />
      </div>
      <Chats />
    </div>
  );
};

export default Sidebar;
