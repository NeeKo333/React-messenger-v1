import { signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth, storage, AuthContext, firestore } from "../..";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const Navbar = () => {
  const { userName, authUser, userPhoto, setUserPhoto } =
    useContext(AuthContext);
  const [avatarIsSelected, setAvatarIsSelected] = useState(false);
  const navigator = useNavigate();

  function signOutHandler(a) {
    signOut(a);
    navigator("/login");
  }

  function uploadAvatar(e) {
    e.preventDefault();

    const storageRef = ref(storage, userName);

    const uploadTask = uploadBytesResumable(storageRef, e.target[0].files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(firestore, "users", authUser.uid), {
            photoURL: downloadURL,
          });
          setUserPhoto(downloadURL);
        });
      }
    );
    e.target.reset();
    setAvatarIsSelected(false);
  }
  return (
    <div className="userInfo">
      <div className="userInfoConteiner">
        <div className="userNameAndAvatarConteiner">
          <img className="mainUserAvatar" src={userPhoto} alt=""></img>
          <span className="userName">{userName}</span>
        </div>
        <div className="userUploadAvatarConteiner">
          <form onSubmit={(e) => uploadAvatar(e)}>
            <input
              type="file"
              id="uploadAvatar"
              accept=".jpg, .jpeg, .png"
              className="hide"
              onChange={() => setAvatarIsSelected(true)}
            ></input>
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              htmlFor="uploadAvatar"
              className={
                avatarIsSelected
                  ? "uploadAvatarLabel active"
                  : "uploadAvatarLabel"
              }
            >
              <img className="uploadImg" src="/img/upload.png" alt=""></img>
            </motion.label>
            <button
              className={
                avatarIsSelected ? "uploadAvatarBtn active" : "uploadAvatarBtn"
              }
            >
              Upload Avatar
            </button>
          </form>
        </div>
      </div>
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => signOutHandler(auth)}
      >
        <img src="/img/logout.svg" alt=""></img>
      </motion.a>
    </div>
  );
};

export default Navbar;
