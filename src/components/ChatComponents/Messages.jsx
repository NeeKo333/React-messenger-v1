import React, { useContext, useState, useEffect, useRef } from "react";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import Message from "./Message";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
import EditMessagePopup from "./EditMessagePopup";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const { data } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const ref = useRef();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "privateChatsWithTwoUsers", data.chatId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      }
    );
    setCurrentPage(1);
    return () => {
      unsub();
    };
  }, [data.chatId]);

  useEffect(() => {
    setVisibleMessages(messages.slice(-15 * currentPage));
  }, [currentPage, messages]);

  useEffect(() => {
    setTimeout(() => ref.current.scrollIntoView(), 300);
  }, [messages]);

  function getCurrentMessage(e) {
    if (
      e.target.className === "editMessage active" &&
      e.target.closest(".message").dataset.owner === authUser.uid
    ) {
      setPopup(true);
      setCurrentMessage({
        id: e.target.closest(".message").id,
        text: e.target.closest(".editMessageDiv").nextElementSibling.innerText,
      });
    }
  }

  function editMessage(newText) {
    const chatId = data.chatId;
    const updatedArray = [...messages];
    const index = updatedArray.findIndex((el) => el.id === currentMessage.id);
    updatedArray[index].text = newText;

    if (index === updatedArray.length - 1) {
      updateDoc(doc(firestore, "userChats", authUser.uid), {
        [data.chatId + ".userInfo.lastMessage"]: newText,
      });
      updateDoc(doc(firestore, "userChats", data.user.uid), {
        [data.chatId + ".userInfo.lastMessage"]: newText,
      });
    }

    updateDoc(doc(firestore, "privateChatsWithTwoUsers", chatId), {
      messages: updatedArray,
    });
  }

  function updateMessage(e) {
    e.preventDefault();
    setPopup(false);
    editMessage(e.target[0].value);
  }

  function deleteMessage(el) {
    const id = el.closest(".message").id;
    const chatId = data.chatId;
    const updatedArray = [...messages].filter((el) => el.id !== id);

    updateDoc(doc(firestore, "userChats", authUser.uid), {
      [data.chatId + ".userInfo.lastMessage"]:
        updatedArray[updatedArray.length - 1].text,
      [data.chatId + ".userInfo.lastMessageTime"]:
        updatedArray[updatedArray.length - 1].date,
    });
    updateDoc(doc(firestore, "userChats", data.user.uid), {
      [data.chatId + ".userInfo.lastMessage"]:
        updatedArray[updatedArray.length - 1].text,
      [data.chatId + ".userInfo.lastMessageTime"]:
        updatedArray[updatedArray.length - 1].date,
    });

    updateDoc(doc(firestore, "privateChatsWithTwoUsers", chatId), {
      messages: updatedArray,
    });
  }

  function scrollHendler(e) {
    console.log(e.target.scrollTop, e.target.scrollHeight, window.innerHeight);
    if (e.target.scrollTop < 230) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div
      onScroll={(e) => scrollHendler(e)}
      className="messages"
      onClick={(e) => {
        getCurrentMessage(e);
        if (e.target.className === "deleteMessage active") {
          deleteMessage(e.target);
        }
      }}
    >
      {popup && (
        <EditMessagePopup
          submitHandler={updateMessage}
          currentText={currentMessage.text}
          closePopup={() => setPopup(false)}
        />
      )}

      {visibleMessages.map((message) => (
        <Message key={message.id} messegeInfo={message}></Message>
      ))}

      <div ref={ref}></div>
    </div>
  );
};

export default Messages;
