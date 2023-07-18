import React, { useContext, useState } from "react";
import { doc, collection, getDocs, getDoc, setDoc, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { HiUserAdd } from "react-icons/hi";
import { MdChat } from "react-icons/md";
import { ChatContext } from "../context/ChatContext";
import avatar from "../images/avatar.png";


const Search = (props) => {
  const { setIsSearching } = props;
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const openChat = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
    setUsers(null);
    setUserName("");
  };

  const handleSearch = async (e) => {
    setUsers(null);
    if(e.target.value.trim() === "") {
      setIsSearching(false)    
      setErr(false);
    }
    setUserName(e.target.value.trim());

    if (e.target.value.trim() !== "" && e.target.value.length >= 2) {
      setIsSearching(true);
      const name = e.target.value.toLowerCase();
      const q = query(collection(db, "users"));
      try {
        const querySnapshot = await getDocs(q);
        let matchedUsers = [];
        querySnapshot.forEach((doc) => {
          const displayName = doc.data().displayName.toLowerCase();
          if (displayName.includes(name)) {
            matchedUsers.push(doc.data());
          }
        });
        if (matchedUsers.length === 0) {
          setUsers(null);
          setErr(true);
        } else {
          setUsers(matchedUsers);
          setErr(false);
        }
      } catch (err) {
        setErr(true);
      }
    }
  };

  const addFriend = async (user) => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(err.message);
    }
    openChat(user)
    setUsers(null);
    setUserName("");
  };


  const checkIsFriend = async (user) => {
    const userChatsRef = doc(db, "userChats", currentUser.uid);
    const userChatsDoc = await getDoc(userChatsRef);
    if (userChatsDoc.exists()) {
      const userChatsData = userChatsDoc.data();
      const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
      if (userChatsData[combinedId] && userChatsData[combinedId].userInfo.uid === user.uid) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }
    } else {
      setIsFriend(false);
    }
  };

  return (
    <>
      <div className="p-2 mr-2 w-full bg-darkblue flex flex-col justify-start sm:w-1/3 lg:w-1/4">
        <div className="w-full">
          <input
            type="search"
            onChange={handleSearch}
            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-500 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-50  transition duration-300 ease-in-out focus:border-primary-300 focus:text-gray-50 shadow-te-primary outline-none dark:placeholder:text-gray-50 "
            name="exampleSearch"
            value={userName}
            placeholder="Find a user"
          />
        </div>
        {err && (
          <span className="flex flex-row justify-center w-full text-white p-2  text-center items-center ">
            User not found !
          </span>
        )}

        { users &&
          users.map((user) => {
            checkIsFriend(user)
            return (
              <ul className="w-full flex justify-start items-start relative h-full mt-2" key={user.uid}>
                { isFriend ? (
                  // Display the chat icon for friend
                  <li onClick={() => openChat(user)} className="flex items-center justify-between p-3 hover:bg-regal-blue hover:cursor-pointer rounded-md w-full md:p-2">
                    <div className="flex flex-row justify-center items-center">
                      <img
                        src={user.photoURL}
                        alt={avatar}
                        className="w-12 h-12 mr-3 rounded-full md:mr-2 lg:mr-3"
                      />
                      <span className="font-bold text-white">
                        {user.displayName}
                      </span>
                    </div>
                    <div className="flex justify-end items-center">
                      <MdChat
                        className="text-white text-2xl mr-4 cursor-pointer"
                      />
                    </div>
                  </li>
                  ) : (
                    // Display add friend icon for non-friend
                    <li className="flex justify-between items-center p-2 hover:bg-regal-blue rounded-md w-full">
                      <div className="flex flex-row justify-center items-center">
                        <img
                          src={user.photoURL}
                          alt={avatar}
                          className="w-12 h-12 mr-4 rounded-full"
                        />
                        <span className="font-bold text-white">
                          {user.displayName}
                        </span>
                      </div>
                      <div className="flex justify-end items-center">
                        <HiUserAdd
                          className="text-white text-3xl mr-4 cursor-pointer"
                          onClick={() => addFriend(user)}
                        />
                      </div>
                    </li>
                  )
                }
              </ul>
            );
          })
        }
      </div>
    </>
  );
};

export default Search;
