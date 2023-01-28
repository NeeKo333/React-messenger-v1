import { AuthContext, firestore } from "../..";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import moment from "moment";

const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  const [userMessagePhoto, setUserMessagePhoto] = useState(""); //user photo next to the message
  const [isHover, setIsHover] = useState(false); // display interaction buttons when hovering over a message

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
            {messegeInfo.ownerID === authUser.uid ? (
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
                      ? "replyMessageButton active owner"
                      : "replyMessageButton"
                  }
                >
                  reply
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
            ) : (
              <div
                className={
                  isHover ? "replyMessageButton active" : "replyMessageButton"
                }
              >
                reply
              </div>
            )}

            {messegeInfo.replay && (
              <div className="messageReply">
                <span>{messegeInfo.replay.ownerName}</span>
                <span>{messegeInfo.replay.text}</span>
                {messegeInfo.replay.photoURL && (
                  <img src={messegeInfo.replay.messagePhoto} alt=""></img>
                )}
              </div>
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

            {messegeInfo.messageVideo ? (
              <video
                className="messageVideo"
                src={messegeInfo.messageVideo}
                alt=""
                controls
              ></video>
            ) : (
              ""
            )}

            <div className="messageEditedMark">
              {messegeInfo.edited ? "edited" : ""}
            </div>
          </div>
          <div className="messageTime">{getTime(messegeInfo.date.seconds)}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
