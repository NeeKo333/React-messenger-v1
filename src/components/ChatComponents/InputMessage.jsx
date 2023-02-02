import { AuthContext, storage, firestore } from "../..";
import { ChatContext } from "../../chatContext";
import { useContext, useState, useRef } from "react";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import Preview from "./Preview";

const InputMessage = ({ replyMessage, getPeply }) => {
  const [inputText, setInputText] = useState(""); // Text from message input
  const [inputFile, setInputFile] = useState(""); // File from message input
  const [showEmoji, setShowEmoji] = useState(false); // Emoji window display settings
  const { authUser, userName, userPhoto } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext); // Data to check that the chat is not deleted and reducer to reset if chat deleted
  const [picture, setPicture] = useState(null); //preview
  const [pictureVisible, setPictureVisible] = useState(false); //previewVisible
  const fileInputRef = useRef(null); // Ref to input to reset the file when deleting through the preview

  async function sendMessage(e, inputMessage) {
    const message = inputMessage;
    e.preventDefault();
    inputFile ? sendFileAndText() : sendText();

    if (showEmoji) setShowEmoji(false);

    function sendFileAndText() {
      setPictureVisible(false);
      setInputText("");

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, inputFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        async () => {
          const metadata = await getMetadata(uploadTask.snapshot.ref);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const messageInfo = {
              id: uuid(),
              text: message,
              ownerName: userName,
              photoURL: userPhoto,
              ownerID: authUser.uid,
              date: Timestamp.now(),
              messagePhoto: metadata.contentType !== "video/mp4" && downloadURL,
              messageVideo: metadata.contentType === "video/mp4" && downloadURL,
              replay: replyMessage ? replyMessage : false,
            };

            getPeply("");

            if (message || inputFile) {
              const Ref = doc(
                firestore,
                "privateChatsWithTwoUsers",
                data.chatId
              );
              await updateDoc(Ref, {
                messages: arrayUnion(messageInfo),
              });

              await updateDoc(doc(firestore, "userChats", authUser.uid), {
                [data.chatId + ".userInfo.lastMessage"]:
                  inputText || "📷 Picture",
                [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
                [data.chatId + ".userInfo.lastMessageTime"]: serverTimestamp(),
              });

              await updateDoc(doc(firestore, "userChats", data.user.uid), {
                [data.chatId + ".userInfo.lastMessage"]:
                  inputText || "📷 Picture",
                [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
                [data.chatId + ".userInfo.lastMessageTime"]: serverTimestamp(),
              });

              // setInputText("");
              setInputFile("");
            }
          });
        }
      );
    }

    async function sendText() {
      setInputText("");
      const messageInfo = {
        id: uuid(),
        text: message,
        ownerName: userName,
        photoURL: userPhoto,
        ownerID: authUser.uid,
        date: Timestamp.now(),
        replay: replyMessage ? replyMessage : false,
      };
      getPeply("");

      if (message) {
        const Ref = doc(firestore, "privateChatsWithTwoUsers", data.chatId);
        await updateDoc(Ref, {
          messages: arrayUnion(messageInfo),
        });

        await updateDoc(doc(firestore, "userChats", authUser.uid), {
          [data.chatId + ".userInfo.lastMessage"]: inputText,
          [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
          [data.chatId + ".userInfo.lastMessageTime"]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "userChats", data.user.uid), {
          [data.chatId + ".userInfo.lastMessage"]: inputText,
          [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
          [data.chatId + ".userInfo.lastMessageTime"]: serverTimestamp(),
        });
      }
    }
  }

  function emojiPick(e) {
    setInputText(inputText + e.emoji);
  }

  const Freader = new FileReader();
  Freader.onload = function (e) {
    setPicture(e.target.result);
    setPictureVisible(true);
  };

  return (
    <div className="inputMessageWrapper">
      {replyMessage && (
        <div className="replayMessageBody">
          <div className="replayMessageBlockOnInput">
            <div className="replayMessageContent">
              <p>{replyMessage.ownerName}</p>
              <span>{replyMessage.text}</span>
            </div>
            <span className="removeReply" onClick={() => getPeply("")}>
              <img src="/img/closePreview.png"></img>
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          sendMessage(e, inputText);
          e.target.reset();
        }}
        className="inputMessageContainer"
      >
        <input
          onChange={async (e) => {
            setInputText(e.target.value.slice(0, 250));
            const res = await getDoc(doc(firestore, "userChats", authUser.uid));
            if (res.data()[data.chatId]) {
            } else await dispatch({ type: "reset", payload: authUser });
          }}
          value={inputText}
          className="inputMessage"
          placeholder="Enter message..."
        ></input>

        <input
          className="hide"
          onChange={(e) => {
            if (e.target.files[0].size <= 100000000) {
              Freader.readAsDataURL(e.target.files[0]);
              setInputFile(e.target.files[0]);
            } else alert("File size can not be larger than 100MB!");
          }}
          ref={fileInputRef}
          type="file"
          id="uploadImg"
          accept=".jpg, .jpeg, .png, .mp4"
        ></input>

        {pictureVisible && (
          <Preview
            previwSrc={picture && picture}
            deletePreview={() => {
              setPictureVisible(false);
              setInputFile("");
              fileInputRef.current.value = "";
            }}
          ></Preview>
        )}

        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor="uploadImg"
          className="uploadImgLabel"
        >
          <img src="/img/upload.png" alt="" className="uploadImg"></img>
        </motion.label>

        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="emojiBtn"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <img src="/img/emoji.png"></img>
        </motion.a>

        {showEmoji && (
          <EmojiPicker
            onEmojiClick={emojiPick}
            searchDisabled={true}
            emojiStyle="twitter"
            skinTonesDisabled={true}
            lazyLoadEmojis={true}
          />
        )}

        <motion.button
          className="sendMessage"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="sendMessageTriangle"></div>
        </motion.button>
      </form>
    </div>
  );
};

export default InputMessage;
