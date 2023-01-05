import React, { useContext, useState, useEffect, useRef } from "react";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import Message from "./Message";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
import EditMessagePopup from "./EditMessagePopup";
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [popup, setPopup] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const { data } = useContext(ChatContext);
  const ref = useRef();
  const { authUser } = useContext(AuthContext);

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

  function getCurrentMessage(e) {
    if (
      e.target.className === "messageText" &&
      e.target.closest(".message").dataset.owner === authUser.uid
    ) {
      setPopup(true);
      setCurrentMessage(e.target.closest(".message").id);
    }
  }

  async function editMessage(newText) {
    const chatId = data.chatId;
    const message = await getDoc(
      doc(firestore, "privateChatsWithTwoUsers", chatId)
    );
    const updatedArray = [...message.data().messages];
    const index = updatedArray.findIndex((el) => el.id === currentMessage);
    updatedArray[index].text = newText;

    await updateDoc(doc(firestore, "privateChatsWithTwoUsers", chatId), {
      messages: updatedArray,
    });
  }

  function updateMessage(e) {
    e.preventDefault();
    setPopup(false);
    editMessage(e.target[0].value);
  }

  return (
    <div
      className="messages"
      onClick={(e) => {
        getCurrentMessage(e);
      }}
    >
      {popup && (
        <EditMessagePopup
          submitHandler={updateMessage}
          closePopup={() => setPopup(false)}
        />
      )}
      {messages.map((message) => (
        <Message key={message.id} messegeInfo={message}></Message>
      ))}
      <div ref={ref}></div>
    </div>
  );
};

export default Messages;
