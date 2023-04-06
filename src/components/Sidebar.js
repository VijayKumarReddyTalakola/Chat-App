// import React from 'react'
// import Navbar from './Navbar';
// import Search from './Search';
// import Chats from './Chats';

// const Sidebar = () => {
//   return (
//     <div className="container flex flex-col top-0 justify-start min-h-screen bg-darkblue overflow-x-hidden md:w-1/4">
//       <Navbar/>
//       <Search/>
//       <Chats/>
//     </div>
//   );
// }

// export default Sidebar



// import React from "react";
// import Navbar from "./Navbar";
// import Search from "./Search";
// import Chats from "./Chats";

// const Sidebar = () => {
//   return (
//     <div className="container flex flex-col top-0 justify-center min-h-screen bg-darkblue overflow-x-hidden md:w-1/4">
//       <div className="flex flex-col">
//         <Navbar />
//         <Search />
//       </div>
//       <Chats />
//     </div>
//   );
// };

// export default Sidebar;



import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div className=" flex flex-col justify-start min-h-screen bg-darkblue overflow-x-hidden md:w-1/4">
      <div className="sticky top-0 w-screen z-50">
        <Navbar />
        <Search />
      </div>
      <Chats />
    </div>
  );
};

export default Sidebar;
