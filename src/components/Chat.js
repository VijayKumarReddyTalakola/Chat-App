import React, { useContext, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { deleteField, doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { deleteObject, ref } from "firebase/storage";
import avatar from "../images/avatar.png";
// import Logo from '/VChat.png'


const Chat = ({ setOverlayVisible }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { data, dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const openFullScreen = () => {
    document.getElementById("profile")?.requestFullscreen();
  };

  const closeChat = (user) => {
    dispatch({ type: "REMOVE_USER", payload: user });
    setIsDropdownOpen(false);
  };

  const deletePhotos = async () => {
    const chatDocRef = doc(db, "chats", data.chatId);
    const chatSnapshot = await getDoc(chatDocRef);
    const messages = chatSnapshot.data()?.messages;
    messages?.forEach(async (message) => {
      if (message.img) {
        await deleteObject(ref(storage, message.id));
      }
    });
  };

  const clearChat = async () => {
    deletePhotos();
    await setDoc(doc(db, "chats", data.chatId), { messages: [] });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: "",
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: "",
    });
    setIsDropdownOpen(false);
  };

  const removeFriend = async () => {
    const batch = writeBatch(db);
    const currentUserRef = doc(db, "userChats", currentUser.uid);
    batch.update(currentUserRef, {
      [data.chatId]: deleteField(),
    });
    const friendUserRef = doc(db, "userChats", data.user.uid);
    batch.update(friendUserRef, {
      [data.chatId]: deleteField(),
    });
    deletePhotos();
    const chatDocRef = doc(db, "chats", data.chatId);
    batch.delete(chatDocRef);
    await batch.commit();
    setIsDropdownOpen(false);
    closeChat(data?.user);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowPopup(true);
    setIsDropdownOpen(false);
    setOverlayVisible(true);
  };

  const handleSelectedOption = () => {
    if (selectedOption === "Remove Friend") {
      removeFriend();
    } else if (selectedOption === "Clear Chat") {
      clearChat();
    }
    closePopup();
  };

  const closePopup = () => {
    setShowPopup(false);
    setOverlayVisible(false);
  };

  // const handleSearch =() =>{
  //   console.log(data.chatId.messages)
  // }

  return (
    <>
      {data.chatId !== "null" ? (
        <div className="relative flex flex-col items-center min-h-screen w-full bg-shadywhite overflow-hidden md:w-2/3 lg:w-3/4 h-full">
          <div className="flex justify-between items-center bg-shadyblue w-full px-4 py-3">
            <div className="flex items-center flex-row">
              <FiArrowLeft
                className="w-7 h-7 text-gray-200 -ml-2 cursor-pointer sm:hidden"
                onClick={() => closeChat(data?.user)}
              />
              <img
                src={data.user?.photoURL}
                id="profile"
                onClick={openFullScreen}
                alt={avatar}
                className="w-10 h-10 mr-3 ml-2 rounded-full cursor-pointer"
              />
              <span className="text-white font-medium text-2xl">
                { (data.user?.uid === currentUser.uid ) ?  ((data.user?.displayName)+' (You)') : (data.user?.displayName)}
              </span>
            </div>
            <div className="flex items-center">
              <AiOutlineSearch
                className="text-white w-7 h-6 mr-3 cursor-not-allowed md:mx-5"
                // onClick={()=>handleSearch()}
              />
              <FiMoreVertical
                className="text-white w-7 h-7 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute z-50 right-2 top-16 py-2 w-40 bg-shadywhite border rounded shadow-lg">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-shadyblue cursor-pointer hover:text-white"
                      onClick={() => handleOptionChange("Remove Friend")}
                    >
                      Unfriend
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-shadyblue cursor-pointer hover:text-white"
                      onClick={() => handleOptionChange("Clear Chat")}
                    >
                      Clear Chat
                    </li>
                    <li
                      className="hidden sm:block px-4 py-2 sm: hover:bg-shadyblue cursor-pointer hover:text-white"
                      onClick={() => closeChat(data?.user)}
                    >
                      Close Chat
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className=" flex flex-col w-full overflow-y-scroll bg-shadywhite max-h-[calc(100vh-7rem)]">
            {showPopup && (
              <div className="z-50 flex absolute top-1/3 left-2/5 ml-12 flex-col  min-h-[30%] p-5 min-w-[75%] max-w-[60%] items-center text-center bg-darkblue md:p-7 md:min-w-[70%] md:max-h-[50%] md:min-h-max md:ml-20 lg:ml-52 lg:min-w-[30%] lg:max-w-[50%] xl:ml-56">
                <div className="flex flex-col">
                  <h3 className="text-white text-xl flex justify-start md:text-2xl">
                    {selectedOption} ?
                  </h3>
                  <p className=" mt-4 text-gray-300 text-sm font-medium flex justify-start text-start md:text-lg md:font-normal">
                    {`You are about to ${selectedOption} . Messages will be deleted permanently for everyone and cannot be recovered later.`}
                  </p>
                </div>
                <div className="flex mt-3 justify-end items-end">
                  <button
                    className="ml-4 bg-transparent px-4 py-1.5 border-2 border-shadyblue rounded-xl text-gray-300 my-2.5 hover:text-blue-400 sm:ml-5 mr-3"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                  <button
                    className="ml-4 bg-blue-500 px-4 py-2 rounded-xl text-white my-2.5 hover:bg-blue-700 md:ml-5 mr-3"
                    onClick={handleSelectedOption}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            <Messages />
          </div>
          <Input />
        </div>
      ) : (
        <div className="hidden md:flex flex-col min-h-screen p-4 w-full font-bold justify-center items-center text-center text-3xl bg-shadywhite overflow-x-hidden md:w-2/3 lg:w-3/4 ">
          <div className="flex flex-col justify-center items-center ">
            {/* <img src='/VChat.png' alt="" className="w-20 h-20 rounded-2xl" /> */}
            <p>Welcome to VChat</p>
          </div>
          <div className="text-lg font-normal">
            Send and receive messages without having any external apps.
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
