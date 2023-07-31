import { deleteUser, signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { FiMoreVertical } from "react-icons/fi";
import avatar from "../images/avatar.png";
// import { deleteField, doc, writeBatch } from "firebase/firestore";


const Navbar = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const { setisProfileOpen, isDropdownOpen, setIsDropdownOpen } = props;


  const openFullScreen = () => {
    document.getElementById("dp")?.requestFullscreen();
  };


  // const RemoveAccount = async () => {
  //   const batch = writeBatch(db);
  //   const UserRef = doc(db, "users", currentUser.uid);
  //   batch.delete(UserRef);
  //   const UserDocRef = doc(db, "userChats", currentUser.uid);
  //   batch.update(UserDocRef, {
  //     [data.chatId]: deleteField(),
  //   });
  //   await batch.commit();
  //   deleteUser(auth.currentUser)
  // };

  const Logout = () => {
    dispatch({ type: "REMOVE_USER", payload: data?.user });
    signOut(auth);
  };

  return (
    <header className="relative top-0 left-0 md:w-1/3 lg:w-1/4  inset-x-0 shadow-lg bg-regal-blue flex items-center justify-between p-3 gap-2 ">
      <div className="flex">
        <h1 className="text-white font-medium text-2xl text-start top-0 left-0 ml-0">
          VChat
        </h1>
      </div>
      <ul className="flex flex-row justify-center items-center">
        <li>
          <img
            src={currentUser.photoURL}
            onClick={openFullScreen}
            alt={avatar}
            id="dp"
            className="w-9 h-9 mr-3 rounded-full cursor-pointer md:w-10 md:h-10"
          />
        </li>
        <li>
          <span className="font-bold text-white mt-2 sm:text-2xl md:font-normal">
            {currentUser.displayName?.split(" ")[0]}
          </span>
        </li>
        <li>
          <FiMoreVertical
            id="dropdown"
            className="text-white w-7 h-7 mt-1 ml-2 cursor-pointer md:ml-3"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </li>
        {isDropdownOpen && (
          <div className="absolute z-50 right-1 top-16 py-2 w-40 bg-darkblue rounded shadow-lg">
            <ul>
              <li
                className="px-4 py-2 text-white hover:bg-regal-blue cursor-pointer"
                onClick={() => setisProfileOpen(true)}
              >
                Profile
              </li>
              {/* <li
                className="px-4 py-2 text-white hover:bg-regal-blue cursor-pointer"
                onClick={() => RemoveAccount()}
              >
                Delete Account
              </li> */}
              <li
                className="px-4 py-2 text-white hover:bg-regal-blue cursor-pointer"
                onClick={() => Logout()}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
