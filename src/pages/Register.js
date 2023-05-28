import React, { useState } from "react";
import avatar from "../images/addAvatar.png";
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
    if (!file) {
      setErr("Please select an avatar.");
      return;
    }

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const storageRef = ref(storage, displayName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      (err) => {
          console.log(err.message);
          setErr(`Failed to upload avatar`);
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
      var errCode = err.code;
      if (errCode === "auth/invalid-email") {
        setErr(`Enter a valid email!`);
      }
      else if (errCode === "auth/email-already-in-use") {
        setErr(`Email already exists!`);
      } 
      else if (errCode === "auth/weak-password") {
        setErr(`Password should be at least 6 characters`);
      }
    console.log(err.message);
  }
}

  return (
    <div id="register" className="w-screen flex flex-col items-center justify-center min-h-screen bg-shadyblue overflow-x-hidden">
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
            <label className=" flex justify-center font-medium cursor-pointer mt-7" htmlFor="avatar">
              <img src={avatar} alt="add avatar"  className="w-7 h-7 rounded-t "/>
                Add your Avatar 
            </label>
            <input onChange={(e)=>setFile(e.target.files[0])} type="file" id="avatar" className="invisible" />
          </div>
          <div className="mt-0">
            <button type="submit" className="bg-shadyblue text-white w-full py-2 rounded-md hover:bg-darkblue focus:outline-none ">
              Register
            </button>
          </div>
          {err && <span className="mt-2 flex justify-center items-center text-center text-red-500">{err}</span>}
          <div className=" mt-3 flex justify-center items-center text-center">
            <p>You have an account ?</p>
            <Link to="/login" className="text-blue-500 ml-2 hover:text-purple-700">Login</Link>
          </div>
        </form>
      </div>
    </div>
  ); 
};

export default Register;
