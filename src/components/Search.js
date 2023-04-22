import React, { useState } from "react";
import { collection ,getDocs,query ,where } from "firebase/firestore";
import { db } from "../firebase"; 

const Search = () => {
  const [userName,setUserName] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false)

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
  return (
    <>
      <div className="p-2 mx-1 bg-darkblue flex justify-start sm:pr-2">
        <div className="w-full  px-0 sm:w-1/3  pl-2 pr-7 lg:w-1/4 ">
          <input
            type="text" 
            onKeyDown={handleKey}
            onChange={(e)=>setUserName(e.target.value)}
            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-500 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-50 outline-none transition duration-300 ease-in-out focus:border-primary-300 focus:text-gray-50 shadow-te-primary outline-none dark:placeholder:text-gray-50 "
            id="exampleSearch"
            placeholder="Find a user"
          />
        </div>
        {err && <span>User not found!</span>}
        {user &&
        <div className="flex flex-col">
          <ul className="w-screen flex flex-col justify-start items-start relative  h-full m:w-1/3 lg:w-1/4">
            <li className="flex items-center  mx-3 p-2 hover:bg-regal-blue rounded-md w-screen">
              <img src={user.photoURL} alt="Vijay's profile" className="w-12 h-12 mr-4 rounded-full cursor-pointer"/>
              <div className="flex flex-col">
                <span className="font-bold text-white">{user.displayName}</span>
              </div>
            </li>
          </ul>
        </div>
        }
      </div>
    </>
  );
};

export default Search;

