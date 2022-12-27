import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../..";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../..";

const Navbar = () => {
  const { userName } = useContext(AuthContext);
  const navigator = useNavigate();
  function signOutHandler(a) {
    signOut(a);
    navigator("/login");
  }
  return (
    <div className="userInfo">
      <span className="userName">{userName}</span>
      <button onClick={() => signOutHandler(auth)}>Log out</button>
    </div>
  );
};

export default Navbar;
