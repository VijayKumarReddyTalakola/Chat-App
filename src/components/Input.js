import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import Picker from "emoji-picker-react";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const messageId = uuid();

  const handleEmojiClick = (emojiPicked) => {
    let msg = text;
    msg += emojiPicked.emoji;
    setText(msg);
  };

  const updateLastMessage = async () => {
    const newMessage = {
      id: messageId,
    };
    if (text.trim() !== "") newMessage.text = text;
    if (file) newMessage.file = file.name;

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: newMessage,
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: newMessage,
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };

  const checkMessageExists = async (newMessage) => {
    const chatDocRef = doc(db, "chats", data.chatId);
    const chatDoc = await getDoc(chatDocRef);
    const messages = chatDoc.data().messages || [];
    const isMessageUnique = !messages.some(
      (message) => message.id === newMessage.id
    );
    if (isMessageUnique) {
      await updateDoc(chatDocRef, {
        messages: arrayUnion(newMessage),
      });
      updateLastMessage();
    } else {
      console.log("Message already exists.");
    }
  };

  const sendMessage = async () => {
    if (text.trim() === "" && !file) {
      return;
    }
    const newMessage = {
      id: messageId,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    if (text.trim() !== "") newMessage.text = text;

    if (file) {
      const fileName = file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            newMessage.file = downloadURL;
            newMessage.fileName = file.name;
            newMessage.downloaded = false;
            checkMessageExists(newMessage);
          });
        }
      );
    } else {
      checkMessageExists(newMessage);
    }

    setText("");
    setFile(null);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex absolute left-0 bottom-0 w-full  ">
      <div className="flex flex-row absolute bottom-0 left-0 w-full bg-gray-50">
        <div className="relative flex flex-col-reverse">
          <BsEmojiSmile
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center w-5 h-5 text-gray-600 mx-3 my-5 cursor-pointer"
          />
        </div>
        <input
          type="text"
          onKeyDown={(e) => e.code === "Enter" && sendMessage()}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          value={text}
          className="w-full outline-none my-3 bg-gray-50 text-gray-700"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          id="fileupload"
          className="invisible w-1 h-1"
        />
        <label htmlFor="fileupload">
          <ImAttachment className="flex items-center w-5 h-5 text-gray-500 mx-2 mt-5 cursor-pointer" />
        </label>
        <MdSend
          onClick={sendMessage}
          className=" flex items-center cursor-pointer ml-4 mr-4 text-4xl text-blue-500 my-3 hover:text-blue-700 "
        />
      </div>
      <div className="ml-3 mb-[4.5rem] overflow-y-scroll overflow-x-auto ">
        {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
      </div>
    </div>
  );
};

export default Input;
