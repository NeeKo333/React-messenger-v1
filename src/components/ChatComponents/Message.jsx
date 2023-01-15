import { AuthContext, firestore } from "../..";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";

const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  const [userMessagePhoto, setUserMessagePhoto] = useState("");
  const [isHover, setIsHover] = useState(false);
  getDoc(doc(firestore, "users", messegeInfo.ownerID)).then((doc) =>
    setUserMessagePhoto(doc.data().photoURL)
  );

  function getTime(seconds) {
    return moment(seconds * 1000)
      .startOf("minutes")
      .fromNow();
  }

  return (
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
          <div className="messageUserAvatar">
            <img src={userMessagePhoto} alt="" />
          </div>
        </div>

        <div className="messageBody">
          <div
            className={
              messegeInfo.ownerID === authUser.uid
                ? "messageOwnerNameRight"
                : "messageOwnerNameLeft"
            }
          >
            {messegeInfo.ownerName}
          </div>
          <div
            className="messageContent"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {messegeInfo.ownerID === authUser.uid && (
              <>
                <div
                  className={isHover ? "deleteMessage active" : "deleteMessage"}
                >
                  <img
                    className={
                      isHover ? "deleteMessage active" : "deleteMessage"
                    }
                    src="/img/deleteMessage.svg"
                    alt=""
                  ></img>
                </div>
                <div
                  className={
                    isHover
                      ? "editMessage active editMessageDiv"
                      : "editMessage"
                  }
                >
                  <img
                    className={isHover ? "editMessage active" : "editMessage"}
                    src="/img/editMessage.svg"
                    alt=""
                  ></img>
                </div>
              </>
            )}

            <span className="messageText">{messegeInfo.text}</span>
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
          <div className="messageTime">{getTime(messegeInfo.date.seconds)}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
