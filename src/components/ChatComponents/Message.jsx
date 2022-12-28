import { AuthContext } from "../..";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../..";
const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  const [userMessagePhoto, setUserMessagePhoto] = useState("");
  getDoc(doc(firestore, "users", messegeInfo.ownerID)).then((doc) =>
    setUserMessagePhoto(doc.data().photoURL)
  );
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
          <img src={userMessagePhoto} alt="" />
        </div>
        <span className="messageOwnerName">{messegeInfo.ownerName}</span>
        <span className="messageText">{messegeInfo.text}</span>
      </div>
    </div>
  );
};

export default Message;
