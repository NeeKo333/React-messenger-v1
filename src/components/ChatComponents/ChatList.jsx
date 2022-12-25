import React, { useState, useContext, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../..";
import { AuthContext } from "../..";

const ChatList = () => {
  const { authUser } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "userChats", authUser.uid),
      (doc) => {
        setChatList(Object.entries(doc.data()));
      }
    );

    return () => {
      unsub();
    };
  }, [authUser.uid]);

  return (
    <div className="chatList">
      {chatList.length > 0 ? (
        chatList.map((chat) => {
          return (
            <div className="userChat">
              <div className="userChatInfo">
                <span className="userChatUserName">
                  {chat[1].userInfo.name}
                </span>
                <div className="userChatUserAvatar">
                  <img src="https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg"></img>
                </div>
              </div>
              <p className="userChatLastMessage">
                {chat[1].userInfo.lastMessage?.text}
              </p>
            </div>
          );
        })
      ) : (
        <h3>No chats</h3>
      )}
    </div>
  );
};

export default ChatList;
