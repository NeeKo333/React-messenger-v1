import React, { useContext, useState, useEffect, useRef } from "react";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import Message from "./Message";
import { ChatContext } from "../../core/context/chatContext";
import { firestore, AuthContext } from "../../core/context/authContext";
import EditMessagePopup from "./EditMessagePopup";

const Messages = ({ getReply }) => {
  const [messages, setMessages] = useState([]);
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
    setTimeout(() => ref.current.scrollIntoView(), 300);
  }, [messages]);

  function getCurrentMessage(e) {
    if (
      e.target.className === "edit-message active" &&
      e.target.closest(".message").dataset.owner === authUser.uid
    ) {
      setPopup(true);
      setCurrentMessage({
        id: e.target.closest(".message").id,
        text: messages.find((el) => el.id === e.target.closest(".message").id)
          .text,
      });
    }
  }

  function editMessage(newText) {
    const chatId = data.chatId;
    const updatedArray = [...messages];
    const index = updatedArray.findIndex((el) => el.id === currentMessage.id);
    updatedArray[index].text = newText;
    updatedArray[index].edited = true;

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

  function replyToMessage(e) {
    const id = e.target.closest(".message").id;
    const message = messages.find((el) => el.id === id);
    getReply(message);
  }

  function scrollHendler(e) {
    if (e.target.scrollTop < 230) {
      setCurrentPage(currentPage + 1);
    }
  }

  function messageClickHandler(e) {
    getCurrentMessage(e);
    if (e.target.className === "delete-message active") {
      deleteMessage(e.target);
    }
    if (
      e.target.className === "reply-message-button active" ||
      e.target.className === "reply-message-button active owner"
    ) {
      replyToMessage(e);
    }
  }

  function getVisibleMessages() {
    return messages.slice(-15 * currentPage);
  }

  const visibleMessages = getVisibleMessages();

  return (
    <div
      onScroll={(e) => scrollHendler(e)}
      className="messages"
      onClick={(e) => {
        messageClickHandler(e);
      }}
    >
      {popup && (
        <EditMessagePopup
          submitHandler={updateMessage}
          currentText={currentMessage.text}
          closePopup={() => setPopup(false)}
        />
      )}

      {visibleMessages.map((message) => {
        const stringifyMessage = JSON.stringify(message);
        return (
          <Message key={message.id} messegeInfo={stringifyMessage}></Message>
        );
      })}

      <div ref={ref}></div>
    </div>
  );
};

export default Messages;
