import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../..";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigator = useNavigate();
  function signOutHandler(a) {
    signOut(a);
    navigator("/login");
  }
  return (
    <div className="userInfo">
      <span className="userName">Jhon</span>
      <button onClick={() => signOutHandler(auth)}>Log out</button>
    </div>
  );
};

export default Navbar;
