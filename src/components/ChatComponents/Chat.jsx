import React, { useContext, useState } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
import {
  doc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";

const Chat = () => {
  const { data, dispatch } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  async function updateCheckTime() {
    const res = await getDoc(doc(firestore, "userChats", authUser.uid));
    if (res.data()[data.chatId]) {
      updateDoc(doc(firestore, "userChats", authUser.uid), {
        [data.chatId + ".userInfo.lastCheckTime"]: serverTimestamp(),
      });
    } else await dispatch({ type: "reset", payload: authUser });
  }

  if (data.chatId === "null") {
    return <div></div>;
  }

  async function deleteChat() {
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

    await dispatch({ type: "reset", payload: authUser });
  }
  return (
    <div onClick={updateCheckTime} className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">{data.user?.name}</span>
        <button className="deleteChat" onClick={deleteChat}>
          deleteChat
        </button>
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
