// import React from 'react'

// const Chats = () => {
//   return (
//     <>
//     <div className="w-screen flex flex-row justify-start items-start relative hover:bg-regal-blue  ml-4 md:w-1/4">
//           <img src="https://picsum.photos/200" alt="Profile" className="w-10 h-10 mr-4 rounded-full cursor-pointer"/>
//           <span className="font-bold text-white mt-2">Vijay</span>
//     </div>
//     </>
//   )
// }

// export default Chats


import React from "react";

const Chats = () => {
  return (
    <ul className="w-screen flex flex-col justify-start items-start relative  md:w-1/4">
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue w-screen">
        <img
          src="https://picsum.photos/200"
          alt="Vijay's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">Vijay</span>
          <p className="text-gray-300">Hello </p>
        </div>
      </li>
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue  w-screen">
        <img
          src="https://picsum.photos/200"
          alt="John's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">Joe</span>
          <p className="text-gray-300">Hi</p>
        </div>
      </li>
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue  w-screen">
        <img
          src="https://picsum.photos/200"
          alt="Jane's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">John</span>
          <p className="text-gray-300">How are u?</p>
        </div>
      </li>
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue w-screen">
        <img
          src="https://picsum.photos/200"
          alt="Vijay's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">Vijay</span>
          <p className="text-gray-300">Hello </p>
        </div>
      </li>
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue  w-screen">
        <img
          src="https://picsum.photos/200"
          alt="John's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">Joe</span>
          <p className="text-gray-300">Hi</p>
        </div>
      </li>
      <li className="flex items-center mt-1 mx-3 hover:bg-regal-blue  w-screen">
        <img
          src="https://picsum.photos/200"
          alt="Jane's profile"
          className="w-10 h-10 mr-4 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">John</span>
          <p className="text-gray-300">How are u?</p>
        </div>
      </li>
    </ul>
  );
};

export default Chats;
