// import React from "react";
// import pic from "../images/pic.jpg";

// const Message = () => {
//   return (
//     <>
//       <div className="flex flex-row ml-4 sm:ml-7">
//         <div className="flex flex-col my-2 justify-items-end">
//           <div className="flex flex-col ">
//             <p className="flex justfy-end bg-white max-w-fit mr-auto text-black px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg ">
//               Hello  i am John 
//             </p>
//             <span className="flex text-gray-500 my-1 text-xs md:text-sm">2 min ago</span>
//           </div>
//           <div className="flex flex-col justify-items-end bg-white p-1">
//             <img src={pic} alt="User profile " className="h-56 w-48 rounded-md md:w-48 h-64 "/>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-row-reverse mr-4 md:mr-7">
//         <div className="flex flex-col my-2 justify-items-end">
//           <div className="flex flex-col ">
//             <p className="flex justfy-end bg-blue-400 max-w-fit ml-auto  text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg ">
//               Hello i am Vijay
//             </p>
//             <span className="flex justify-end text-gray-500 my-1 text-xs sm:text-sm">Just now</span>
//           </div>
//           <div className="flex flex-col justify-items-end bg-white p-1">
//             <img src={pic} alt="User profile " className="h-56 w-48 rounded-md sm:w-48 h-64 "
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Message;



import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRef } from "react";
import { useEffect } from "react";
import { ChatContext } from "../context/ChatContext";

const Message = ({message}) => {
  console.log(message)
   const { currentUser } = useContext(AuthContext);
   const { data } = useContext(ChatContext)
   const ref = useRef()

   useEffect(() => {
     ref.current?.scrollIntoView({behaviour:"smooth"})
   }, [message])
   
  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse mr-4  min-h-[90vh] md:mr-7">
          <div className="flex flex-col my-2 justify-items-end">
            <div className="flex flex-col ">
              <p className="flex justfy-end bg-blue-400 max-w-fit ml-auto  text-white px-3 py-1 rounded-b-lg rounded-tr-none rounded-tl-lg ">
                {message.text}
              </p>
              <span className="flex justify-end text-gray-500 my-1 text-xs sm:text-sm">
                Just now
              </span>
            </div>
            { message.img && 
            <div className="flex flex-col justify-items-end bg-white p-1">
              <img
                src={message.img}
                alt="User profile "
                className="h-56 w-48 rounded-md sm:w-48 sm:h-64 "
              />
            </div>
            }
          </div>
        </div>
      ) : (
        <div ref={ref} className="flex flex-row ml-4  min-h-[calc(100vh-1rem)] sm:ml-7">
          <div className="flex flex-col my-2 justify-items-end">
            <div className="flex flex-col ">
              <p className="flex justfy-end bg-white max-w-fit mr-auto text-black px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg ">
               {message.text}
              </p>
              <span className="flex text-gray-500 my-1 text-xs md:text-sm">
                2 min ago
              </span>
            </div>
            {message.img &&
            <div className="flex flex-col justify-items-end bg-white p-1">
              <img
                src={message.img}
                alt="User profile "
                className="h-56 w-48 rounded-md md:w-48 md:h-64 "
              />
            </div>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default Message;







