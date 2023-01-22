import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { AuthContext, firestore } from "../..";
import { motion } from "framer-motion";

const UserSearch = () => {
  const [searchUserName, setSearchUserName] = useState("");
  const [searchedUser, setSearchedUser] = useState({});
  const { authUser } = useContext(AuthContext);

  async function searchOnFirestore(e) {
    if (e.code === "Enter") {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("name", "==", searchUserName));
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setSearchedUser({ empty: true });
        }
        querySnapshot.forEach((user) => {
          if (user.data().userId !== authUser.uid) {
            setSearchedUser(user.data());
          }
        });
      } catch (error) {
        console.log("error.message");
      }
    }
  }

  async function addChatWithTwoUsers() {
    const combinedId =
      authUser.uid > searchedUser.userId
        ? authUser.uid + searchedUser.userId
        : searchedUser.userId + authUser.uid;

    const response = await getDoc(
      doc(firestore, "privateChatsWithTwoUsers", combinedId)
    );

    if (!response.exists()) {
      await setDoc(doc(firestore, "privateChatsWithTwoUsers", combinedId), {
        messages: [],
      });

      await updateDoc(doc(firestore, "userChats", authUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: searchedUser.userId,
          name: searchedUser.name,
          photoURL: searchedUser.photoURL,
          lastChatUpdate: serverTimestamp(),
          lastCheckTime: Timestamp.now(),
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      const user = await getDoc(doc(firestore, "users", authUser.uid));

      await updateDoc(doc(firestore, "userChats", searchedUser.userId), {
        [combinedId + ".userInfo"]: {
          uid: authUser.uid,
          name: user.data().name,
          photoURL: user.data().photoURL,
          lastChatUpdate: serverTimestamp(),
          lastCheckTime: Timestamp.now(),
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }

    setSearchUserName("");
    setSearchedUser({});
  }

  if (searchedUser.empty) {
    return (
      <div className="userSearchConteiner">
        <input
          onChange={(e) => setSearchUserName(e.target.value)}
          onKeyDown={(e) => searchOnFirestore(e)}
          value={searchUserName}
          className="userSearch"
          placeholder="Search user"
        ></input>
        <motion.div
          onClick={() => setSearchedUser({})}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="userSearchedChat"
        >
          <div className="userSearchedChatTitle">User not found!</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="userSearchConteiner">
      <input
        onChange={(e) => setSearchUserName(e.target.value)}
        onKeyDown={(e) => searchOnFirestore(e)}
        value={searchUserName}
        className="userSearch"
        placeholder="Search user"
      ></input>
      {Object.keys(searchedUser).length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="userSearchedChat"
          onClick={() => addChatWithTwoUsers()}
        >
          <div className="userChatInfo">
            <div className="userChatUserName">{searchedUser.name}</div>
            <div className="userSearchedChatUserAvatar">
              <img src={searchedUser.photoURL} alt=""></img>
            </div>
          </div>
          <div className="userSearchedChatTitle">
            Click to add user in your chat list!
          </div>
        </motion.div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserSearch;
