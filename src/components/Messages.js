import React, { useContext, useState, useEffect } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userChats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
  }, [data.chatId]);

  return (
    <div className="flex flex-col bg-shadywhite w-full p-2 overflow-y-scroll">
      { messages.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
