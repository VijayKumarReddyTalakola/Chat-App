import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import avatar from "../images/avatar.png";
import { IoMdDocument } from "react-icons/io";
import { deleteObject, getMetadata, ref as storageRef } from "firebase/storage";

const Message = ({ message }) => {
  const isImage = /\.(jpeg|jpg|png|gif|webp|tiff|bmp)$/i.test(message?.fileName);
  const [fileSize, setFileSize] = useState(null);
  const [selected, setselected] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  const getTimeFromTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return format(date, "h:mm a");
  };

  const openFullScreen = () => {
    document.getElementById(`${message.id}`)?.requestFullscreen();
  };

  const updateLastMessage = (message, document) => {
    const documentData = document.data();
    const fieldIds = Object.keys(document.data());
    fieldIds.forEach(async (fieldId) => {
      if (fieldId === data.chatId) {
        const lastMessageData = documentData[fieldId].lastMessage;
        if (lastMessageData?.id === message.id) {
          const updatedLastMessage = {
            [`${fieldId}.lastMessage.id`]: message.id,
            [`${fieldId}.lastMessage.deleted`]: true,
            [`${fieldId}.lastMessage.text`]: deleteField(),
            [`${fieldId}.lastMessage.file`]: deleteField(),
          };
          await updateDoc(doc(db, "userChats", document.id),updatedLastMessage);
        }
      }
    });
  };

  const deleteMessage = async (message) => {
    if (message.file) {
      await deleteObject(storageRef(storage, message.id));
    }
    if (message.senderId === currentUser.uid) {
      const chatDocRef = doc(db, "chats", data.chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (chatDoc.exists()) {
        const messages = chatDoc.data().messages;
        const updatedMessages = messages.filter((msg) => msg.id !== message.id);
        await updateDoc(chatDocRef, { messages: updatedMessages });

        const userChatsDocRef = doc(db, "userChats", currentUser.uid);
        const userChatsDoc = await getDoc(userChatsDocRef);
        updateLastMessage(message, userChatsDoc);

        const otherUserChatsDocRef = doc(db, "userChats", data.user.uid);
        const otherUserChatsDoc = await getDoc(otherUserChatsDocRef);
        updateLastMessage(message, otherUserChatsDoc);
      }
    }
  };

  const extractFileType = (fileName) => {
    const parts = fileName.split(".");
    if (parts.length > 1) {
      const type = parts[parts.length - 1];
      return type.toUpperCase();
    }
    return null;
  };

  const formatFileSize = (bytes) => {
    const sizeInKB = bytes / 1024;
    const sizeInMB = bytes / (1024 * 1024);

    if (sizeInMB >= 1) {
      return sizeInMB.toFixed(2) + " mb";
    } else {
      return sizeInKB.toFixed(2) + " kb";
    }
  };

  useEffect(() => {
    const getFileSize = async (id) => {
      try {
        const fileRef = storageRef(storage, id);
        const metadata = await getMetadata(fileRef);
        const size = formatFileSize(metadata.size);
        setFileSize(size);
      } catch (error) {
        console.error("Error getting metadata(size):", error);
      }
    };
    getFileSize(message.id);
  }, [message.id]);

  return (
    <>
      {message?.senderId === currentUser.uid ? (
        <div ref={ref} className="flex flex-row-reverse mb-2">
          <div
            onMouseOver={() => setselected(true)}
            onMouseLeave={() => setselected(false)}
            className="flex flex-row-reverse max-w-[90%] lg:max-w-[60%]"
          >
            <img
              src={currentUser?.photoURL || avatar}
              alt="avatar"
              onClick={openFullScreen}
              className=" w-10 h-10 rounded-full"
            />
            {/* Only text */}
            {message?.text && !message?.file && (
              <div className=" flex flex-col my-2 justify-items-end">
                <div className="flex justify-items-end items-center bg-blue-400 px-3 py-1 ml-auto mr-2 rounded-b-lg rounded-tr-none rounded-tl-lg">
                  <p className="flex text-white break-words">{message.text}</p>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500 mr-2">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            )}
            {/* Only Image */}
            {message?.file &&
              !message?.text &&
              (isImage ? (
                <div className="flex flex-col my-2 justify-items-end">
                  <div className="flex flex-col justify-items-end bg-blue-400 p-1 m-1 rounded">
                    <img
                      id={message.id}
                      src={message.file}
                      onDoubleClick={openFullScreen}
                      alt="Message"
                      className="w-64 h-72 rounded-md cursor-pointer"
                    />
                  </div>
                  <span className="flex text-xs justify-end my-1 text-gray-500">
                    {getTimeFromTimestamp(message.date)}
                  </span>
                </div>
              ) : (
                // Only File except Image
                <div className="flex flex-col my-2 justify-items-end">
                  <a href={message.file} download={message.fileName}>
                    <div className="flex justify-items-end items-center text-white bg-blue-400 pl-2 w-72 pr-4 py-2 m-1 rounded">
                      <IoMdDocument className="w-9 h-9 m-1" />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold truncate">
                          {message.fileName}
                        </span>
                        <span className="text-white">
                          {fileSize} , {extractFileType(message.fileName)}
                        </span>
                      </div>
                    </div>
                  </a>
                  <span className="flex text-xs justify-end my-1 text-gray-500">
                    {getTimeFromTimestamp(message.date)}
                  </span>
                </div>
              ))}
            {/* Both text and Image */}
            {message.file &&
              message.text &&
              (isImage ? (
                <div className="flex flex-col my-2">
                  <div className="flex flex-col bg-blue-400 p-1 m-1 rounded">
                    <img
                      id={message.id}
                      src={message.file}
                      onDoubleClick={openFullScreen}
                      alt="Message"
                      className="w-64 h-72 m-0.5 rounded-md cursor-pointer"
                    />
                    <p className="flex justify-start flex-wrap break-words bg-blue-400 w-64 mr-auto text-white p-1 rounded-none">
                      {message.text}
                    </p>
                  </div>
                  <span className="flex text-xs justify-end my-1 text-gray-500">
                    {getTimeFromTimestamp(message.date)}
                  </span>
                </div>
              ) : (
                // both file and text
                <div className="flex flex-col my-2">
                  <div className="flex flex-col m-1 p-1 bg-blue-400 rounded text-white">
                    <a href={message.file} download={message.fileName}>
                      <div className="flex justify-items-end items-center p-2 w-72 rounded bg-blue-500">
                        <IoMdDocument className="w-9 h-9 m-1" />
                        <div className="flex flex-col truncate">
                          <span className="font-semibold truncate">
                            {message.fileName}
                          </span>
                          <span className="text-white">
                            {fileSize} , {extractFileType(message.fileName)}
                          </span>
                        </div>
                      </div>
                    </a>
                    <p className="flex justify-start flex-wrap break-words w-72 mr-auto p-1 rounded-none">
                      {message.text}
                    </p>
                  </div>
                  <span className="flex text-xs justify-end my-1 text-gray-500">
                    {getTimeFromTimestamp(message.date)}
                  </span>
                </div>
              ))}
            {selected && (
              <MdDelete
                className=" text-blue-500 mr-1 mt-3 cursor-pointer"
                onClick={() => deleteMessage(message)}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          ref={ref}
          className="flex flex-row mb-2 max-w-[90%] lg:max-w-[60%]"
        >
          <img
            src={data.user?.photoURL}
            alt={avatar}
            className="w-10 h-10 rounded-full"
          />
          {/* Only text */}
          {message?.text && !message.file && (
            <div className="flex flex-col my-2">
              <div className="flex justify-end bg-white ml-2 mr-auto px-3 py-1 rounded-b-lg rounded-tl-none rounded-tr-lg">
                <p className="text-black break-words">{message.text}</p>
              </div>
              <span className="flex text-xs justify-end my-1 text-gray-500">
                {getTimeFromTimestamp(message.date)}
              </span>
            </div>
          )}
          {/* only Image */}
          {message?.file &&
            !message?.text &&
            (isImage ? (
              <div className="flex flex-col my-2">
                <div className="flex justify-items-end bg-white p-1 m-1 rounded">
                  <img
                    id={message.id}
                    src={message.file}
                    onDoubleClick={openFullScreen}
                    alt="Message"
                    className="w-64 h-72 rounded-md cursor-pointer"
                  />
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            ) : (
              // only file except image
              <div className="flex flex-col my-2">
                <a href={message.file} download={message.fileName}>
                  <div className="flex justify-items-end items-center bg-white pl-2 pr-4 py-2 m-1 w-72 rounded">
                    <IoMdDocument className="w-9 h-9 m-1" />
                    <div className="flex flex-col truncate">
                      <span className="font-semibold truncate">
                        {message.fileName}
                      </span>
                      <span>
                        {fileSize} , {extractFileType(message.fileName)}
                      </span>
                    </div>
                  </div>
                </a>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            ))}
          {/* Both text and image */}
          {message.file &&
            message.text &&
            (isImage ? (
              <div className="flex flex-col my-2">
                <div className="flex flex-col justify-items-end bg-white p-1 m-1 rounded ">
                  <img
                    id={message.id}
                    src={message.file}
                    onDoubleClick={openFullScreen}
                    alt="Message"
                    className="w-64 h-72 m-0.5 rounded-md cursor-pointer"
                  />
                  <p className="flex justify-start break-words bg-white w-64 mr-auto text-black p-1 rounded-b-lg rounded-tl-none rounded-tr-lg ">
                    {message.text}
                  </p>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            ) : (
              // both file and text
              <div className="flex flex-col my-2">
                <div className="flex flex-col justify-items-end bg-white p-1 m-1 rounded ">
                  <a href={message.file} download={message.fileName}>
                    <div className="flex justify-items-end items-center p-2 rounded w-72 bg-gray-300">
                      <IoMdDocument className="w-9 h-9 m-1" />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold truncate">
                          {message.fileName}
                        </span>
                        <span>
                          {fileSize} , {extractFileType(message.fileName)}
                        </span>
                      </div>
                    </div>
                  </a>
                  <p className="flex justify-start break-words w-72 mr-auto text-black p-1 rounded-b-lg rounded-tl-none rounded-tr-lg ">
                    {message.text}
                  </p>
                </div>
                <span className="flex text-xs justify-end my-1 text-gray-500">
                  {getTimeFromTimestamp(message.date)}
                </span>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default Message;
