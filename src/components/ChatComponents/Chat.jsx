import React, { useContext, useState } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
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

  async function updateCheckTime() {
    const res = await getDoc(doc(firestore, "userChats", authUser.uid));
    if (res.data()[data.chatId]) {
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

  if (data.chatId === "null") {
    return <div className="chat"></div>;
  }

  return (
    <div onClick={updateCheckTime} className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">{data.user?.name}</span>
        <motion.a
          whileHover={{ scale: 1.1 }}
          className="deleteChat"
          onClick={() => setPopup(true)}
        >
          <img src="/img/deleteChat.svg"></img>
        </motion.a>
        {popup && (
          <DeleteChatPopup
            submitHandler={deleteChat}
            closePopup={() => setPopup(false)}
          ></DeleteChatPopup>
        )}
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
