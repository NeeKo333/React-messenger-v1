import React, { useState, useContext, useEffect } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, AuthContext } from "../..";
import { ChatContext } from "../../chatContext";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const ChatList = () => {
  const { authUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [chatList, setChatList] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [avatars, setAvatars] = useState([]);

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

  useEffect(() => {
    async function unreadMessages() {
      const response2 = await getDoc(doc(firestore, "userChats", authUser.uid));
      let res = [];
      for (let i = 0; i < chatList.length; i++) {
        const user = chatList[i][1].userInfo;
        const combinedId =
          authUser.uid > user.uid
            ? authUser.uid + user.uid
            : user.uid + authUser.uid;

        const response = await getDoc(
          doc(firestore, "privateChatsWithTwoUsers", combinedId)
        );

        res.push(
          response
            .data()
            .messages.filter(
              (el) =>
                el.date?.seconds >
                  response2.data()[combinedId].userInfo.lastCheckTime
                    ?.seconds &&
                el.ownerID !== authUser.uid &&
                el.ownerID !== data.user.uid
            )
        );
      }
      return res;
    }
    async function getPhotos() {
      let res = [];
      for (let i = 0; i < chatList.length; i++) {
        const user = chatList[i][1].userInfo;
        const response = await getDoc(doc(firestore, "users", user.uid));
        res.push(response.data().photoURL);
      }
      return res;
    }
    unreadMessages().then((data) => setUnreadMessages(data));
    getPhotos().then((data) => setAvatars(data));
  }, [chatList]);

  function getTime(seconds) {
    return moment(seconds * 1000)
      .startOf("minutes")
      .fromNow();
  }

  async function pickChat(user) {
    dispatch({ type: "change_user", payload: user });
    const combinedId =
      authUser.uid > user.uid
        ? authUser.uid + user.uid
        : user.uid + authUser.uid;

    await updateDoc(doc(firestore, "userChats", authUser.uid), {
      [combinedId + ".userInfo.lastCheckTime"]: Timestamp.now(),
    });
  }

  return (
    <div className="chatList">
      <AnimatePresence>
        {chatList.length > 0 ? (
          chatList.map((chat, index) => {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                key={chat[0]}
                className="userChat"
                onClick={() => pickChat(chat[1].userInfo)}
              >
                <div className="userChatInfo">
                  <span className="userChatUserName">
                    {chat[1].userInfo.name}
                  </span>

                  <div className="userChatUserAvatar">
                    <img src={avatars[index]} alt=""></img>
                  </div>
                </div>

                <p className="userChatLastMessage">
                  {chat[1].userInfo.lastMessage
                    ? chat[1].userInfo.lastMessage.length > 15
                      ? chat[1].userInfo.lastMessage.slice(0, 15) + "..."
                      : chat[1].userInfo.lastMessage
                    : ""}
                </p>

                <p className="userChatLastMessageTime">
                  {chat[1].userInfo.lastMessageTime?.seconds
                    ? getTime(chat[1].userInfo.lastMessageTime?.seconds)
                    : "Click and start chat..."}
                </p>

                {unreadMessages[index] && unreadMessages[index].length > 0 ? (
                  <span className="userChatUnreadMessages">
                    {unreadMessages[index].length}
                  </span>
                ) : (
                  ""
                )}
              </motion.div>
            );
          })
        ) : (
          <h3 className="searchFriendsTitle">
            Search freinds and start your first chat 😀
          </h3>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatList;
