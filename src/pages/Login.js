import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
  }catch(err){
    setErr(true);
  }
}

  return (
    <div id='login' className="w-screen flex flex-col items-center justify-center min-h-screen bg-blue-400 overflow-x-hidden">
      <div className="w-full max-w-xs sm:max-w-sm ">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-blueTheme text-center text-2xl font-bold">
            <p>Login</p>
          </h2>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
               Email
            </label>
            <input type="email" id="email" onChange={(e)=>setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
               Password
            </label>
            <input type="password" id="password" onChange={(e)=>setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password" required/>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md focus:outline-none focus:bg-blue-500">
              Login
            </button>
          </div>
            {err && <span>Something went wrong!</span>}
          <Link to='/register' className=" flex items-center justify-center mt-3">
            Don't have an account ? Signup
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login