import React from "react";
import ChatList from "./ChatList";
import Navbar from "./Navbar";
import UserSearch from "./UserSearch";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar></Navbar>
      <UserSearch></UserSearch>
      <ChatList></ChatList>
      <div className="footer">CHEESE</div>
    </div>
  );
};

export default Sidebar;
