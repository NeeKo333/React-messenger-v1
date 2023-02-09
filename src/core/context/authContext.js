import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import React, { createContext, useEffect, useState } from "react";
import { firebaseConfig } from "../config/firebaseConfig";

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
