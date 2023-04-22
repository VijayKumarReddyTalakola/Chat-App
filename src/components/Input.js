import React from "react";
import attach from '../images/attach.png'
const Input = () => {
  return (
    <div className="flex flex-row absolute bottom-0 left-0 w-full bg-gray-50 mt-2 pl-4">
      <input type="text" placeholder="Type a message..." className="w-full outline-none my-4 bg-gray-50 text-gray-500"/>
      <input type="file" id="fileupload" className="invisible" />
      <label htmlFor="fileupload">
        <img src={attach}  alt="file/doc" className="w-12 h-12 mt-1 mx-7 cursor-pointer md:mx-2"/>
      </label>
      <button className="ml-4 bg-blue-500 px-4 rounded-lg text-white my-2.5 sm:ml-5 mr-3">Send</button>
    </div>
  );
};

export default Input;
