import React from "react";

const Register = () => {
  return (
    <div className="container w-screen flex flex-col items-center justify-center min-h-screen bg-blue-400 overflow-x-hidden">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <form className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-blueTheme text-center text-2xl font-bold">
            <p>Signup</p>
          </h2>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
            </label>
            <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your name" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your email" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input type="password" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password" required/>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="cpassword">
              Confirm Password
            </label>
            <input type="password" id="cpassword" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter your password" required/>
          </div>
          <div className="mt-4 mb-4">
            <label className=" flex justify-center font-bold mb-2" htmlFor="avatar">
             Add your Avatar    +
            </label>
            <input type="file" id="avatar" className="d-none" required/>
          </div>
          <div className="mt-6">
            <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              Register
            </button>
          </div>
        <p className=" flex items-center justify-center mt-3">You have an account ? Login</p>
        </form>
      </div>
    </div>
  );
};

export default Register;
