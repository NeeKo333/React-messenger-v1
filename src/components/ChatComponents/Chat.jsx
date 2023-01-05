import React, { useContext } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../chatContext";
import { firestore, AuthContext } from "../..";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  function updateCheckTime() {
    updateDoc(doc(firestore, "userChats", authUser.uid), {
      [data.chatId + ".userInfo.lastCheckTime"]: serverTimestamp(),
    });
  }

  if (data.chatId === "null") {
    return <div></div>;
  }

  return (
    <div onClick={updateCheckTime} className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">{data.user?.name}</span>
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
