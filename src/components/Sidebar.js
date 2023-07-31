import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import Profile from "./Profile";
import { ChatContext } from "../context/ChatContext";


const Sidebar = () => {

  const { data } = useContext(ChatContext);
  const [isSearching, setIsSearching] = useState(false);  
  const [isProfileOpen, setisProfileOpen] = useState(false);  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return data.chatId === "null" ? (
    isProfileOpen ? (
      <Profile
        setisProfileOpen={setisProfileOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
    ) : (
      <div className="flex flex-col justify-start min-h-screen bg-darkblue overflow-hidden h-full max-h-screen md:w-1/3 lg:w-1/4">
        <div className="sticky top-0 w-screen z-10">
          <Navbar
            setisProfileOpen={setisProfileOpen}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          <Search setIsSearching={setIsSearching} />
        </div>
       { !isSearching && <Chats />}
      </div>
    )
  ) : (
    isProfileOpen ? (
      <Profile
        setisProfileOpen={setisProfileOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
    ) : (
      <div className="hidden md:flex flex-col justify-start min-h-screen bg-darkblue overflow-hidden h-full max-h-screen md:w-1/3 lg:w-1/4">
        <div className="sticky top-0 w-screen z-10">
          <Navbar
            setisProfileOpen={setisProfileOpen}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
          <Search setIsSearching={setIsSearching} />
        </div>
       { !isSearching && <Chats />}
      </div>
    )
  );
}

export default Sidebar;
