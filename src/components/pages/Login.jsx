import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../..";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const navigator = useNavigate();
  async function login(e) {
    e.preventDefault();
    const userEmail = e.target[0].value;
    const userPass = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, userEmail, userPass);
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
        <h2>Login</h2>
        <h3>
          Don't have account? <Link to="/registration">Register</Link>
        </h3>
        <form onSubmit={(e) => login(e)}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </form>
        <div className="copyInfo">
          <p className="lang">EN</p>
          <p className="footerName">CHEESE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
