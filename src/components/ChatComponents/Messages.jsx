import React, { useContext, useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import Message from "./Message";
import { ChatContext } from "../../chatContext";
import { firestore } from "../..";
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "privateChatsWithTwoUsers", data.chatId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      }
    );

    return () => {
      unsub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message messegeInfo={message}></Message>
      ))}
    </div>
  );
};

export default Messages;
