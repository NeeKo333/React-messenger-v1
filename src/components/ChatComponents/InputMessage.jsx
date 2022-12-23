import React from "react";

const InputMessage = () => {
  return (
    <div className="inputMessageContainer">
      <input className="inputMessage" placeholder="Enter message"></input>
      <button className="sendMessage">Send</button>
    </div>
  );
};

export default InputMessage;
