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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import Preview from "./Preview";

const InputMessage = () => {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { authUser, userName, userPhoto } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const [picture, setPicture] = useState(null); //preview
  const [pictureVisible, setPictureVisible] = useState(false); //previewVisible
  const fileInputRef = useRef(null);

  async function sendMessage(e, inputMessage) {
    const message = inputMessage;
    e.preventDefault();
    inputFile ? sendImgAndText() : sendText();

    if (showEmoji) setShowEmoji(false);
    function sendImgAndText() {
      setPictureVisible(false);
      setInputText("");
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, inputFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const messageInfo = {
              id: uuid(),
              text: message,
              ownerName: userName,
              photoURL: userPhoto,
              ownerID: authUser.uid,
              date: Timestamp.now(),
              messagePhoto: downloadURL,
            };

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

              setInputText("");
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
      };

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

  function emojiPeek(e) {
    setInputText(inputText + e.emoji);
  }

  const Freader = new FileReader();
  Freader.onload = function (e) {
    setPicture(e.target.result);
    setPictureVisible(true);
  };

  return (
    <div className="inputMessageWrapper">
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
            Freader.readAsDataURL(e.target.files[0]);
            setInputFile(e.target.files[0]);
          }}
          ref={fileInputRef}
          type="file"
          id="uploadImg"
          accept=".jpg, .jpeg, .png"
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
            onEmojiClick={emojiPeek}
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
