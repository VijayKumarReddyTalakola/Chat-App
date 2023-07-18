import React, { useContext ,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImAttachment } from 'react-icons/im'
import { MdSend } from "react-icons/md";

const Input = () => {
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
    const messageId = uuid();


  const handleSend = async () =>{
    if (text.trim() === "" && !img) {
      // No text or image selected
      return;
    }
    if(img){
      const storageRef = ref(storage, messageId);
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
      (err) => {
        console.log(err)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          await updateDoc(doc(db,'chats',data.chatId),{
            messages: arrayUnion({
              id: messageId,
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            })
          })
        })
      })
    }else{
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: messageId,
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
     [data.chatId +'.lastMessage'] :{
       id: messageId,
       text,
       img: img ? true : false,
     },
     [data.chatId +'.date'] : serverTimestamp()
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
     [data.chatId +'.lastMessage'] :{
       id: messageId,
       text,
       img: img ? true : false, 
     },
     [data.chatId +'.date'] : serverTimestamp()
    });

    setText("")
    setImg(null)
  }

  return (
    <div className="flex flex-row absolute bottom-0 left-0 w-full bg-gray-50 pl-2 lg:pl-4">
      <input type="text" onKeyDown={(e) => e.code === "Enter" && handleSend()} onChange={e => setText(e.target.value)} placeholder="Type a message..." value={text} className="w-full outline-none my-3 bg-gray-50 text-gray-500"/>
      <input type="file" onChange={e => setImg(e.target.files[0])} id="fileupload" className="invisible w-1 h-1" />
      <label htmlFor="fileupload"> 
        <ImAttachment className="flex items-center w-5 h-5 text-gray-500 mx-2 mt-5 cursor-pointer"/>
      </label>
      <MdSend onClick={handleSend} className=" flex items-center cursor-pointer ml-4 mr-4 text-4xl text-blue-500 my-3 hover:text-blue-700 " />
    </div>
  );
};

export default Input;
