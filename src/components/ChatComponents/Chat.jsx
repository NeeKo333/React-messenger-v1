import React from "react";
import InputMessage from "./InputMessage";
import Messages from "./Messages";

const Chat = () => {
  return (
    <div className="chat">
      <div className="chatHeader">
        <span className="chatHeaderUserName">User1</span>
      </div>
      <Messages></Messages>
      <InputMessage></InputMessage>
    </div>
  );
};

export default Chat;
