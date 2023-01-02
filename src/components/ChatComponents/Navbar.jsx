import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth, storage, AuthContext, firestore } from "../..";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const Navbar = () => {
  const { userName, authUser, userPhoto } = useContext(AuthContext);
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
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(firestore, "users", authUser.uid), {
            photoURL: downloadURL,
          });
        });
      }
    );
    e.target.reset();
  }

  return (
    <div className="userInfo">
      <span className="userName">{userName}</span>
      <img className="mainUserAvatar" src={userPhoto} alt=""></img>
      <form onSubmit={(e) => uploadAvatar(e)}>
        <input type="file" id="uploadAvatar" className="hide"></input>
        <label htmlFor="uploadAvatar">
          <img className="uploadImg" src="/img/upload.png" alt=""></img>
        </label>
        <button>Upload Avatar</button>
      </form>
      <button onClick={() => signOutHandler(auth)}>Log out</button>
    </div>
  );
};

export default Navbar;
