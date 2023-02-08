import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../../core/context/authContext";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const navigator = useNavigate();

  async function registration(e) {
    e.preventDefault();
    const userName = e.target[0].value;
    const userEmail = e.target[1].value;
    const userPass = e.target[2].value;

    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("name", "==", userName));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((user) => {
      if (user.data().name) {
        alert("This name already used");
        throw new Error("This name already used");
      }
    });

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
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/react-messenger-71c87.appspot.com/o/noavatar.png?alt=media&token=33151ff5-6995-4787-9ed1-ea0f5329eed1",
      });

      await setDoc(doc(firestore, "userChats", u.uid), {});
      e.target.reset();
      navigator("/chat");
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  }

  return (
    <div className="registerFormConteiner">
      <img src="/img/logo.svg" alt="logo"></img>
      <div className="registerFormWrapper">
        <h2>Registration</h2>
        <h3>
          Already have account? <Link to="/login">Log in</Link>{" "}
        </h3>
        <form onSubmit={(e) => registration(e)}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Submit</button>
        </form>
        <div className="copyInfo">
          <p className="lang">EN</p>
          <p className="footerName">CHEESE</p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
