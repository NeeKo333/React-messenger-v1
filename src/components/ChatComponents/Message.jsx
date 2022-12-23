import React from "react";

const Message = () => {
  return (
    <div className="message">
      <div className="messageInfo">
        <div className="messageUserAvatar">
          <img
            src="https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg"
            alt=""
          />
        </div>
        <span className="messageText">Some Text</span>
      </div>
    </div>
  );
};

export default Message;
