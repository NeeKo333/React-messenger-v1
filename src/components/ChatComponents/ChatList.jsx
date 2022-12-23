import React from "react";

const ChatList = () => {
  return (
    <div className="chatList">
      <div className="userChat">
        <div className="userChatInfo">
          <span className="userChatUserName">User1</span>
          <div className="userChatUserAvatar">
            <img src="https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg"></img>
          </div>
        </div>
        <p className="userChatLastMessage">Hello</p>
      </div>
    </div>
  );
};

export default ChatList;
