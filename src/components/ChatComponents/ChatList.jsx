import React, { useState, useContext, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../..";
import { AuthContext } from "../..";
import { ChatContext } from "../../chatContext";

const ChatList = () => {
  const { authUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
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

  function peekChat(user) {
    dispatch({ type: "change_user", payload: user });
  }

  return (
    <div className="chatList">
      {chatList.length > 0 ? (
        chatList.map((chat) => {
          return (
            <div
              className="userChat"
              onClick={() => peekChat(chat[1].userInfo)}
            >
              <div className="userChatInfo">
                <span className="userChatUserName">
                  {chat[1].userInfo.name}
                </span>
                <div className="userChatUserAvatar">
                  <img src="https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg"></img>
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
