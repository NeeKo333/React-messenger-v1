import { AuthContext, storage, firestore } from "../..";
import { ChatContext } from "../../chatContext";
import { useContext, useState } from "react";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EmojiPicker from "emoji-picker-react";

const InputMessage = () => {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { authUser, userName, userPhoto } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  async function sendMessage(e, inputMessage) {
    const message = inputMessage;
    e.preventDefault();
    inputFile ? sendImgAndText() : sendText();

    function sendImgAndText() {
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
              });

              await updateDoc(doc(firestore, "userChats", data.user.uid), {
                [data.chatId + ".userInfo.lastMessage"]: inputText,
                [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
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
        });

        await updateDoc(doc(firestore, "userChats", data.user.uid), {
          [data.chatId + ".userInfo.lastMessage"]: inputText,
          [data.chatId + ".userInfo.lastChatUpdate"]: serverTimestamp(),
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
        onSubmit={(e) => sendMessage(e, inputText)}
        className="inputMessageContainer"
      >
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          className="inputMessage"
          placeholder="Enter message"
        ></input>
        <input
          className="hide"
          onChange={(e) => setInputFile(e.target.files[0])}
          type="file"
          id="uploadImg"
        ></input>
        <label htmlFor="uploadImg">
          <img src="/img/upload.png" alt="" className="uploadImg"></img>
        </label>
        <a className="emojiBtn" onClick={() => setShowEmoji(!showEmoji)}>
          <img src="/img/emoji.png"></img>
        </a>
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
