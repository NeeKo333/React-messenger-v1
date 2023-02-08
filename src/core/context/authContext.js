import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import React, { createContext, useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCU7J4ZZtld9-77LjitKKjwmxdK3rQHOXI",
  authDomain: "react-messenger-71c87.firebaseapp.com",
  projectId: "react-messenger-71c87",
  storageBucket: "react-messenger-71c87.appspot.com",
  messagingSenderId: "28158697880",
  appId: "1:28158697880:web:5cb9e71bf4960ce42f8bed",
  measurementId: "G-PBKM2DREL4",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(app);
export const storage = getStorage();

/*----Context-----*/

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  useEffect(() => {
    const changeAuthState = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      getDoc(doc(firestore, "users", user.uid)).then((doc) => {
        setUserName(doc.data().name);
        setUserPhoto(doc.data().photoURL);
      });
    });
    return () => changeAuthState();
  });

  return (
    <AuthContext.Provider
      value={{ authUser, userName, userPhoto, setUserPhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
};