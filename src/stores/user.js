import { defineStore } from "pinia";
import { firestore } from "../firebaseResources.js";
import {
  doc,
  getDoc,
} from "firebase/firestore";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
  },
  actions: {
    getUserById(userId) {
      const userRef = doc(firestore, "users", userId);
      return getDoc(userRef)
        .then((document) => {
          if (document.exists()) {
            return {
              id: document.id,
              ...document.data(),
            };
          } else {
            return null;
          }
        })
        .catch((error) => {
          return null;
        });
    },
  },
});
