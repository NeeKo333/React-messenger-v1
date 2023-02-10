import React, { useContext, useState } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../core/context/chatContext";
import { firestore, AuthContext } from "../../core/context/authContext";
import DeleteChatPopup from "./DeleteChatPopup";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  deleteField,
  Timestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";

const Chat = () => {
  const { data, dispatch } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const [popup, setPopup] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  async function updateCheckTime() {
    const result = await getDoc(doc(firestore, "userChats", authUser.uid));
    if (result.data()[data.chatId]) {
      updateDoc(doc(firestore, "userChats", authUser.uid), {
        [data.chatId + ".userInfo.lastCheckTime"]: Timestamp.now(),
      });
    } else await dispatch({ type: "reset", payload: authUser });
  }

  async function deleteChat() {
    setPopup(false);
    await dispatch({ type: "reset", payload: authUser });
    const secondUserUid = await (
      await getDoc(doc(firestore, "userChats", authUser.uid))
    ).data()[data.chatId].userInfo.uid;

    updateDoc(doc(firestore, "userChats", authUser.uid), {
      [data.chatId]: deleteField(),
    });
    updateDoc(doc(firestore, "userChats", secondUserUid), {
      [data.chatId]: deleteField(),
    });
    deleteDoc(doc(firestore, "privateChatsWithTwoUsers", data.chatId));
  }

  function getPeply(message) {
    setReplyMessage(message);
  }

  if (data.chatId === "null") {
    return (
      <div className="not-selected-chat">
        <img className="mouse-picture" src="/img/mouse.svg" alt=""></img>
      </div>
    );
  }

  return (
    <div onClick={updateCheckTime} className="chat">
      <div className="chat-header">
        <span className="chat-header-user-name">{data.user?.name}</span>

        <motion.a
          whileHover={{ scale: 1.1 }}
          className="delete-chat"
          onClick={() => setPopup(true)}
        >
          <img src="/img/deleteChat.svg" alt=""></img>
        </motion.a>

        {popup && (
          <DeleteChatPopup
            submitHandler={deleteChat}
            closePopup={() => setPopup(false)}
          ></DeleteChatPopup>
        )}
      </div>

      <Messages getReply={getPeply}></Messages>

      <InputMessage
        getPeply={getPeply}
        replyMessage={replyMessage}
      ></InputMessage>
    </div>
  );
};

export default Chat;
