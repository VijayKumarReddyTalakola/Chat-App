import React, { useState } from "react";
import pic from "../images/pic.jpg";
import { createUserWithEmailAndPassword , updateProfile } from "firebase/auth";
import { auth ,storage, db } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

const [displayName,setDisplayName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [file,setFile] = useState("");
const [err,setErr] = useState(false);
const navigate = useNavigate();

const handleSubmit = async(e)=>{
  e.preventDefault();

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const storageRef = ref(storage, displayName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      (error) => {
          setErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          await updateProfile(res.user,{
            displayName,
            photoURL : downloadURL,
          })
          await setDoc(doc(db,"users",res.user.uid),{
            uid : res.user.uid,
            displayName,
            email,
            photoURL : downloadURL,
          })
          await setDoc(doc(db,"userChats",res.user.uid),{});
          navigate("/");
        })
      }
    );
  }catch(err){
    setErr(true);
  }
}

  return (
    <div id="register" className="w-screen flex flex-col items-center justify-center min-h-screen bg-blue-400 overflow-x-hidden">
      <div className="w-full max-w-xs sm:max-w-sm ">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-blueTheme text-center text-2xl font-bold">
            <p>Signup</p>
          </h2>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
            </label>
            <input onChange={(e)=>setDisplayName(e.target.value)} type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your name" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password" required/>
          </div>
          <div className="mt-4">
            <label className=" flex justify-center font-bold cursor-pointer mt-7" htmlFor="avatar">
              <img src={pic} alt=""  className="w-7 h-7 rounded-t "/>
              + Add your Avatar 
            </label>
            <input onChange={(e)=>setFile(e.target.files[0])} type="file" id="avatar" className="invisible" required/>
          </div>
          <div className="mt-0">
            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              Register
            </button>
          </div>
          {err && <span>Something went wrong!</span>}
        <Link to="/login" className=" flex items-center justify-center mt-3">You have an account ? Login</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
