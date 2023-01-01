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
} from "firebase/firestore";
import { AuthContext, firestore } from "../..";

const UserSearch = () => {
  const [searchUserName, setSearchUserName] = useState("");
  const [searchedUser, setSearchedUser] = useState({});
  const { authUser } = useContext(AuthContext);

  async function searchOnFirestore(e) {
    if (e.code === "Enter") {
      setSearchedUser({});
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("name", "==", searchUserName));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((user) => {
          setSearchedUser(user.data());
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
          lastCheckTime: serverTimestamp(),
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
          lastCheckTime: serverTimestamp(),
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    }

    setSearchUserName("");
    setSearchedUser({});
  }
  return (
    <div>
      <input
        onChange={(e) => setSearchUserName(e.target.value)}
        onKeyDown={(e) => searchOnFirestore(e)}
        value={searchUserName}
        className="userSearch"
        placeholder="Search user"
      ></input>
      {Object.keys(searchedUser).length > 0 ? (
        <div className="userChat" onClick={() => addChatWithTwoUsers()}>
          <div className="userChatInfo">
            <span className="userChatUserName">{searchedUser.name}</span>
            <div className="userChatUserAvatar">
              <img src={searchedUser.photoURL} alt=""></img>
            </div>
          </div>
        </div>
      ) : (
        <h4>No user searched</h4>
      )}
    </div>
  );
};

export default UserSearch;
