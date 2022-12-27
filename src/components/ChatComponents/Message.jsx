import { AuthContext } from "../..";
import { useContext } from "react";
const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="message">
      <div
        className={
          messegeInfo.ownerID === authUser.uid
            ? "messageInfo message myMessage"
            : " messageInfo message"
        }
      >
        <div className="messageUserAvatar">
          <img
            src="https://i.pinimg.com/736x/f4/d2/96/f4d2961b652880be432fb9580891ed62.jpg"
            alt=""
          />
        </div>
        <span className="messageOwnerName">{messegeInfo.ownerName}</span>
        <span className="messageText">{messegeInfo.text}</span>
      </div>
    </div>
  );
};

export default Message;
