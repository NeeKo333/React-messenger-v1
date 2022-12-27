import { AuthContext } from "../..";
import { ChatContext } from "../../chatContext";
import { useContext, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../..";
import { v4 as uuid } from "uuid";

const InputMessage = () => {
  const [inputText, setInputText] = useState("");
  const { authUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  async function sendMessage(e, message) {
    e.preventDefault();
    const user = await getDoc(doc(firestore, "users", authUser.uid));

    const messageInfo = {
      id: uuid(),
      text: message,
      ownerName: user.data().name,
      ownerID: user.data().userId,
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
      <button className="sendMessage">Send</button>
    </form>
  );
};

export default InputMessage;
