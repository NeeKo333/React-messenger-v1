import { AuthContext, firestore } from "../..";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";
import Twemoji from "react-twemoji";

const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  const [userMessagePhoto, setUserMessagePhoto] = useState("");
  getDoc(doc(firestore, "users", messegeInfo.ownerID)).then((doc) =>
    setUserMessagePhoto(doc.data().photoURL)
  );

  function getTime(seconds) {
    return moment(seconds * 1000)
      .startOf("minutes")
      .fromNow();
  }

  return (
    <Twemoji options={{ className: "twemoji" }}>
      <div className="message">
        <div
          id={messegeInfo.id}
          data-owner={messegeInfo.ownerID}
          className={
            messegeInfo.ownerID === authUser.uid
              ? "messageInfo message myMessage"
              : " messageInfo message"
          }
        >
          <div className="messageUserBody">
            <span className="messageOwnerName">{messegeInfo.ownerName}</span>
            <div className="messageUserAvatar">
              <img src={userMessagePhoto} alt="" />
            </div>
          </div>
          <div className="messageBody">
            <div className="messageContent">
              <div className="messageText">{messegeInfo.text}</div>
              {messegeInfo.messagePhoto ? (
                <img
                  className="messagePhoto"
                  src={messegeInfo.messagePhoto}
                  alt=""
                ></img>
              ) : (
                ""
              )}
            </div>
            <div className="messageTime">
              {getTime(messegeInfo.date.seconds)}
            </div>
          </div>
        </div>
      </div>
    </Twemoji>
  );
};

export default Message;
