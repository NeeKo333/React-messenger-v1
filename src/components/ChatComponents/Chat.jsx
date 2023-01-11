import React, { useContext, useState } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  deleteField,
  Timestamp,
} from "firebase/firestore";

const Chat = () => {
  const { data, dispatch } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  async function updateCheckTime() {
    const res = await getDoc(doc(firestore, "userChats", authUser.uid));
    if (res.data()[data.chatId]) {
      updateDoc(doc(firestore, "userChats", authUser.uid), {
        [data.chatId + ".userInfo.lastCheckTime"]: Timestamp.now(),
      });
    } else await dispatch({ type: "reset", payload: authUser });
  }

  async function deleteChat() {
    await dispatch({ type: "reset", payload: authUser });
    const secondUserUid = await (
      await getDoc(doc(firestore, "userChats", authUser.uid))
    ).data()[data.chatId].userInfo.uid;

    await updateDoc(doc(firestore, "userChats", authUser.uid), {
      [data.chatId]: deleteField(),
    });
    await updateDoc(doc(firestore, "userChats", secondUserUid), {
      [data.chatId]: deleteField(),
    });
    await deleteDoc(doc(firestore, "privateChatsWithTwoUsers", data.chatId));
  }

  if (data.chatId === "null") {
    return <div className="chat"></div>;
  }

  return (
    <div onClick={updateCheckTime} className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">{data.user?.name}</span>
        <a className="deleteChat" onClick={deleteChat}>
          <img src="/img/deleteChat.svg"></img>
        </a>
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
