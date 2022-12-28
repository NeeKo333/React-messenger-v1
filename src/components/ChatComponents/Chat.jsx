import React, { useContext } from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";
import { ChatContext } from "../../chatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  console.log(data);
  return (
    <div className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">{data.user?.name}</span>
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
