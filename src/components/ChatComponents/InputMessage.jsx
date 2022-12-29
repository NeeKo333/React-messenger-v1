import { AuthContext, storage } from "../..";
import { ChatContext } from "../../chatContext";
import { useContext, useState } from "react";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../..";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const InputMessage = () => {
  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState("");
  const { authUser, userName, userPhoto } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  async function sendMessage(e, message) {
    e.preventDefault();

    if (inputFile) {
      sendImgAndText();
    } else {
      sendText();
    }

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
              });

              await updateDoc(doc(firestore, "userChats", data.user.uid), {
                [data.chatId + ".userInfo.lastMessage"]: inputText,
              });

              setInputText("");
              setInputFile("");
            }
          });
        }
      );
    }

    async function sendText() {
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
        });

        await updateDoc(doc(firestore, "userChats", data.user.uid), {
          [data.chatId + ".userInfo.lastMessage"]: inputText,
        });

        setInputText("");
      }
    }
  }

  return (
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
      <button className="sendMessage">Send</button>
    </form>
  );
};

export default InputMessage;
