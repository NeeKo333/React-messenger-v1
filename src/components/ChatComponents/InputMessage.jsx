import { AuthContext, storage, firestore } from "../..";
import { ChatContext } from "../../chatContext";
import { useContext, useState } from "react";
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

const InputMessage = () => {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { authUser, userName, userPhoto } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  async function sendMessage(e, inputMessage) {
    const message = inputMessage;
    e.preventDefault();
    inputFile ? sendImgAndText() : sendText();

    if (showEmoji) setShowEmoji(false);
    function sendImgAndText() {
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

            if (message) {
              const Ref = doc(
                firestore,
                "privateChatsWithTwoUsers",
                data.chatId
              );
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
            setInputText(e.target.value);
            const res = await getDoc(doc(firestore, "userChats", authUser.uid));
            if (res.data()[data.chatId]) {
            } else await dispatch({ type: "reset", payload: authUser });
          }}
          value={inputText}
          className="inputMessage"
          placeholder="Enter message"
        ></input>
        <input
          className="hide"
          onChange={(e) => setInputFile(e.target.files[0])}
          type="file"
          id="uploadImg"
          accept=".jpg, .jpeg, .png"
        ></input>
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor="uploadImg"
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
        <button className="sendMessage">Send</button>
      </form>
    </div>
  );
};

export default InputMessage;
