import { AuthContext, firestore } from "../../core/context/authContext";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getTime } from "../../helpers/getTime";

const Message = ({ messegeInfo }) => {
  const { authUser } = useContext(AuthContext);
  const [userMessagePhoto, setUserMessagePhoto] = useState(""); //user photo next to the message
  const [isHover, setIsHover] = useState(false); // display interaction buttons when hovering over a message

  getDoc(doc(firestore, "users", messegeInfo.ownerID)).then((doc) =>
    setUserMessagePhoto(doc.data().photoURL)
  );

  return (
    <div className="message">
      <div
        id={messegeInfo.id}
        data-owner={messegeInfo.ownerID}
        className={
          messegeInfo.ownerID === authUser.uid
            ? "message-info message my-message"
            : " message-info message"
        }
      >
        <div className="message-user-body">
          <div className="message-user-avatar">
            <img src={userMessagePhoto} alt="" />
          </div>
        </div>

        <div className="message-body">
          <div
            className={
              messegeInfo.ownerID === authUser.uid
                ? "message-owner-name-right"
                : "message-owner-name-left"
            }
          >
            {messegeInfo.ownerName}
          </div>

          <div
            className="message-content"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {messegeInfo.ownerID === authUser.uid ? (
              <>
                <div
                  className={
                    isHover ? "delete-message active" : "delete-message"
                  }
                >
                  <img
                    className={
                      isHover ? "delete-message active" : "delete-message"
                    }
                    src="/img/deleteMessage.svg"
                    alt=""
                  ></img>
                </div>

                <div
                  className={
                    isHover
                      ? "reply-message-button active owner"
                      : "reply-message-button"
                  }
                >
                  reply
                </div>

                <div
                  className={
                    isHover
                      ? "edit-message active edit-message-div"
                      : "edit-message"
                  }
                >
                  <img
                    className={isHover ? "edit-message active" : "edit-message"}
                    src="/img/editMessage.svg"
                    alt=""
                  ></img>
                </div>
              </>
            ) : (
              <div
                className={
                  isHover
                    ? "reply-message-button active"
                    : "reply-message-button"
                }
              >
                reply
              </div>
            )}

            {messegeInfo.replay && (
              <div className="message-reply">
                <span>{messegeInfo.replay.ownerName}</span>
                <span>{messegeInfo.replay.text}</span>
                {messegeInfo.replay.photoURL && (
                  <img src={messegeInfo.replay.messagePhoto} alt=""></img>
                )}
              </div>
            )}

            <span className="message-text">{messegeInfo.text}</span>

            {messegeInfo.messagePhoto ? (
              <img
                className="message-photo"
                src={messegeInfo.messagePhoto}
                alt=""
              ></img>
            ) : (
              ""
            )}

            {messegeInfo.messageVideo ? (
              <video
                className="message-video"
                src={messegeInfo.messageVideo}
                alt=""
                controls
              ></video>
            ) : (
              ""
            )}

            <div className="message-edited-mark">
              {messegeInfo.edited ? "edited" : ""}
            </div>
          </div>
          <div className="message-time">
            {getTime(messegeInfo.date.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
