import firebase from "firebase/app";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { User } from "../model/User";

const userState = atom<User>({
  key: "user",
  default: null,
});

export const useAuthenticate = () => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    console.log("Start useEffect");

    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });

    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        console.log("Set user");

        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        };

        setUser(loginUser);
        createUserIfNotFound(loginUser);
      } else {
        // User is signed out.
        setUser(null);
      }
      // ...
    });
  }, []);
  return { user };
};

const createUserIfNotFound = async (user: User) => {
  const userRef = firebase.firestore().collection("users").doc(user.uid);
  const doc = await userRef.get();

  if (doc.exists) {
    return;
  }

  await userRef.set({
    name: "taro" + new Date().getTime(),
  });
};
