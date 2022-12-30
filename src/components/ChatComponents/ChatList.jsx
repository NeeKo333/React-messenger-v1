import React, { useState, useContext, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore, AuthContext } from "../..";
import { ChatContext } from "../../chatContext";

const ChatList = () => {
  const { authUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, "userChats", authUser.uid),
      (doc) => {
        setChatList(
          Object.entries(doc.data()).sort((a, b) =>
            a[1].userInfo.lastChatUpdate.seconds >
            b[1].userInfo.lastChatUpdate.seconds
              ? -1
              : 1
          )
        );
      }
    );

    return () => {
      unsub();
    };
  }, [authUser.uid]);

  function peekChat(user) {
    dispatch({ type: "change_user", payload: user });
  }

  return (
    <div className="chatList">
      {chatList.length > 0 ? (
        chatList.map((chat) => {
          return (
            <div
              key={chat[0]}
              className="userChat"
              onClick={() => peekChat(chat[1].userInfo)}
            >
              <div className="userChatInfo">
                <span className="userChatUserName">
                  {chat[1].userInfo.name}
                </span>
                <div className="userChatUserAvatar">
                  <img src={chat[1].userInfo.photoURL}></img>
                </div>
              </div>
              <p className="userChatLastMessage">
                {chat[1].userInfo.lastMessage
                  ? chat[1].userInfo.lastMessage
                  : ""}
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
