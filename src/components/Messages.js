import React, { useContext, useState, useEffect } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { format, isToday, isYesterday } from "date-fns";

const Messages = () => {
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        if (chatData.messages) {
          setMessages(chatData.messages);
        } else {
          setMessages([]);
        }
      }
    });

    return () => unsub();
  }, [data.chatId]);

  const groupMessagesByDate = (messages) => {
    if (!messages) {
      return {};
    }

    return messages.reduce((groupedMessages, message) => {
      if (message.date) {
        const date = message.date.toDate();
        const formattedDate = format(date, "d MMMM yyyy");
        if (groupedMessages[formattedDate]) {
          groupedMessages[formattedDate].push(message);
        } else {
          groupedMessages[formattedDate] = [message];
        }
      }
      return groupedMessages;
    }, {});
  };

  const displayDate = (date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "d MMMM yyyy");
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col bg-shadywhite w-full p-2 overflow-y-scroll">
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date}>
          <h2 className="text-gray-700 text-center ">
            {displayDate(new Date(date))}
          </h2>
          {messages.map((message) => (
            <Message message={message} key={message.id} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Messages;
