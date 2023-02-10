import {
  AuthContext,
  storage,
  firestore,
} from "../../core/context/authContext";
import { ChatContext } from "../../core/context/chatContext";
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

  async function checkingExistenceChat() {
    const res = await getDoc(doc(firestore, "userChats", authUser.uid));
    if (res.data()[data.chatId]) {
    } else await dispatch({ type: "reset", payload: authUser });
  }

  function setInputTextHandler(e) {
    setInputText(e.target.value.slice(0, 250));
    checkingExistenceChat();
  }

  async function sendMessage(e, inputMessage) {
    const message = inputMessage;
    e.preventDefault();
    inputFile ? sendFileAndText() : sendText();
    e.target.reset();
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

  function uploadFile(e) {
    if (e.target.files[0].size <= 100000000) {
      Freader.readAsDataURL(e.target.files[0]);
      setInputFile(e.target.files[0]);
    } else alert("File size can not be larger than 100MB!");
  }

  function deletePreviewHandler() {
    setPictureVisible(false);
    setInputFile("");
    fileInputRef.current.value = "";
  }

  const Freader = new FileReader();
  Freader.onload = function (e) {
    setPicture(e.target.result);
    setPictureVisible(true);
  };

  return (
    <div className="input-message-wrapper">
      {replyMessage && (
        <div className="replay-message-body">
          <div className="replay-message-block-on-input">
            <div className="replay-message-content">
              <p>{replyMessage.ownerName}</p>
              <span>{replyMessage.text}</span>
            </div>
            <span className="remove-reply" onClick={() => getPeply("")}>
              <img src="/img/closePreview.png"></img>
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          sendMessage(e, inputText);
        }}
        className="input-message-container"
      >
        <input
          onChange={async (e) => {
            setInputTextHandler(e);
          }}
          value={inputText}
          className="input-message"
          placeholder="Enter message..."
        ></input>

        <input
          className="hide"
          onChange={(e) => {
            uploadFile(e);
          }}
          ref={fileInputRef}
          type="file"
          id="uploadImg"
          accept=".jpg, .jpeg, .png, .mp4"
        ></input>

        {pictureVisible && (
          <Preview
            previwSrc={picture && picture}
            deletePreview={deletePreviewHandler}
          ></Preview>
        )}

        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor="uploadImg"
          className="upload-img-label"
        >
          <img src="/img/upload.png" alt="" className="upload-img"></img>
        </motion.label>

        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="emoji-btn"
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
          className="send-message"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="send-message-triangle"></div>
        </motion.button>
      </form>
    </div>
  );
};

export default InputMessage;
