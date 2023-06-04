import React, { useContext, useState } from "react";
import { doc,collection ,getDocs,getDoc,setDoc,query ,serverTimestamp,updateDoc,where } from "firebase/firestore";
import { db } from "../firebase"; 
import { AuthContext } from "../context/AuthContext";
import { HiUserAdd } from "react-icons/hi";

const Search = () => {
  const [userName,setUserName] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)

  const handleSearch = async ()=>{
    const q = query(collection(db,"users"),where("displayName","==",userName));
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc)=>{
        setUser(doc.data())
      })
    }catch(err){
      setErr(true);
    }
  }
  const handleKey = (e) =>{
    e.code === "Enter" && handleSearch()
  }
  const handleInputChange = (e) => {
    setUserName(e.target.value);
    if (e.target.value === "") {
      setErr(false);
      setUser(null);
    }
  };

  const addFriend = async (user) =>{
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db,'chats',combinedId)) 
      if(!res.exists()){
        await setDoc(doc(db, "chats", combinedId),{messages:[]});

        await updateDoc(doc(db,'userChats',currentUser.uid),{
          [combinedId+".userInfo"] :{
            uid: user.uid,
            displayName :user.displayName,
            photoURL : user.photoURL
          },
          [combinedId+".date"]:serverTimestamp()
        })

        await updateDoc(doc(db,'userChats',user.uid),{
          [combinedId+".userInfo"] :{
            uid: currentUser.uid,
            displayName :currentUser.displayName,
            photoURL : currentUser.photoURL
          },
          [combinedId+".date"]:serverTimestamp()
        })
      }
    } catch (err) {
      setErr(err.message)
    }
    setUser(null)
    setUserName("")
  }

  return (
    <>
      <div className="p-2 mr-2 w-full bg-darkblue flex flex-col justify-start sm:w-1/3 lg:w-1/4">
        <div className="w-full">
          <input
            type="search"
            onKeyDown={handleKey}
            onChange={handleInputChange}
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
        {user && (
          <div className="flex flex-col">
            <ul className="w-full flex justify-start items-start relative h-full mt-2">
              <li className="flex justify-between items-center p-2 hover:bg-regal-blue rounded-md w-full">
                <div className="flex flex-row justify-center items-center">
                  <img src={user.photoURL} alt="Vijay's profile" className="w-12 h-12 mr-4 rounded-full"/>
                  <span className="font-bold text-white">{user.displayName}</span>
                </div>
                <div className="flex justify-end items-center">
                  <HiUserAdd className="text-white text-2xl mr-4 cursor-pointer" onClick={()=>addFriend(user)}  />
                </div> 
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;


