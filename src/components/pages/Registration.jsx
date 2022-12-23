import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../..";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigator = useNavigate();
  async function registration(e) {
    e.preventDefault();
    const userName = e.target[0].value;
    const userEmail = e.target[1].value;
    const userPass = e.target[2].value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPass
      );
      const u = userCredential.user;

      await setDoc(doc(firestore, "users", u.uid), {
        userId: u.uid,
        name: userName,
        email: userEmail,
      });

      await setDoc(doc(firestore, "userChats", u.uid), {});
      e.target.reset();
      navigator("/chat");
    } catch (error) {
      const errorMessage = error.message;
      console.error(errorMessage);
    }
  }

  return (
    <div className="registerFormConteiner">
      <div className="registerFormWrapper">
        <h2>Registration</h2>
        <h3>Already have accaunt? Log in</h3>
        <form onSubmit={(e) => registration(e)}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
