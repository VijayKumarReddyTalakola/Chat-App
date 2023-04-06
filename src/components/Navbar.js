// import React from 'react'

// const Navbar = () => {
//   return (
//     <>
//       <nav className="navbar fixed top-0 left-0 md:w-1/4 lg:fixed top-0 inset-x-0 shadow-lg z-50 bg-regal-blue flex items-center justify-between p-4 gap-2">
//         <div className="flex">
//           <p className="text-white font-medium text-xl top-0 left-0 ml-0">VChat</p>
//         </div>
//         <div className="profile flex flex-row justify-end relative">
//           <img src="https://picsum.photos/200" alt="Profile" className="w-10 h-10 mr-4 rounded-full cursor-pointer"/>
//           <span className="font-bold text-white mt-2">Vijay</span>
//         </div>
//         <div className="text-3xs text-white cursor-pointer sm:text-5xs">Logout</div>
//       </nav>
//     </>
//   );
// }

// export default Navbar




// import React from "react";

// const Navbar = () => {
//   return (
//     <header className="navbar fixed top-0 left-0 md:w-1/4 lg:fixed top-0 inset-x-0 shadow-lg z-50 bg-regal-blue flex items-center justify-between p-4 gap-2">
//       <div className="flex">
//         <h1 className="text-white font-medium text-xl top-0 left-0 ml-0 md:text-xs lg:text-xl">
//           VChat
//         </h1>
//       </div>
//       <ul className="flex flex-row justify-center items-center">
//         <li>
//           <img
//             src="https://picsum.photos/200"
//             alt="User profile"
//             className="w-10 h-10 mr-4 rounded-full cursor-pointer md:w-7 h-7 lg:w-10 h-10"
//           />
//         </li>
//         <li>
//           <span className="font-bold text-white mt-2 md:text-xs lg:text-xl font-normal">Vijay</span>
//         </li>
//         <li>
//           <a
//             href="#home"
//             className="text-3xs text-white cursor-pointer sm:text-5xs ml-4 md:text-xs"
//           >
//             Logout
//           </a>
//         </li>
//       </ul>
//     </header>
//   );
// };

// export default Navbar;


import React from "react";

const Navbar = () => {
  return (
    <header className=" top-0 left-0 md:w-1/4 lg: top-0 inset-x-0 shadow-lg z-50 bg-regal-blue flex items-center justify-between p-4 gap-2">
      <div className="flex">
        <h1 className="text-white font-medium text-xl top-0 left-0 ml-0 md:text-xs lg:text-xl">
          VChat
        </h1>
      </div>
      <ul className="flex flex-row justify-center items-center">
        <li>
          <img
            src="https://picsum.photos/200"
            alt="User profile picture"
            className="w-7 h-7 mx-3 rounded-full cursor-pointer md:w-7 h-7"
          />
        </li>
        <li>
          <span className="font-bold text-white mt-2 md:text-xs lg:text-xl font-normal">
            Vijay
          </span>
        </li>
        <li>
          <a
            href="#"
            className="text-3xs text-white cursor-pointer sm:text-5xs ml-4 md:text-xs"
          >
            Logout
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
