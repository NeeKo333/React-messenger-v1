import React, { useContext, useState, useEffect, useRef } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import Message from "./Message";
import { ChatContext } from "../../chatContext";
import { firestore } from "../..";
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const ref = useRef();

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

  setTimeout(() => ref.current.scrollIntoView(), 300);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} messegeInfo={message}></Message>
      ))}
      <div ref={ref}></div>
    </div>
  );
};

export default Messages;
