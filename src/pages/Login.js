import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Login = () => {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [err,setErr] = useState(false);
const navigate = useNavigate();

const handleSubmit = async(e)=>{
  e.preventDefault();

  try{
    await signInWithEmailAndPassword(auth,email,password);
    navigate("/")
  } catch(err){
    var errCode = err.code;
  if (errCode === "auth/user-not-found") {
    setErr(`User not found!`);
  } 
  else if (errCode === "auth/wrong-password") {
    setErr(`Invalid credentials!`);
  }
  console.log((err.message));
  }
}

  return (
    <div id="login" className="w-screen flex flex-col items-center justify-center min-h-screen bg-shadyblue overflow-x-hidden">
      <div className="w-full max-w-xs sm:max-w-sm ">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-blueTheme text-center text-2xl font-bold">
            <p>Login</p>
          </h2>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password" required/>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-shadyblue  text-white w-full py-2 rounded-md focus:outline-none hover:bg-darkblue">
              Login
            </button>
          </div>
          {err && <span className="mt-2 flex justify-center items-center text-center text-red-500">{err}</span>}
          <div className=" mt-3 flex justify-center items-center text-center">
            <p>Don't have an account ?</p>
            <Link to="/register" className="text-blue-500 ml-2 hover:text-purple-700"> Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login