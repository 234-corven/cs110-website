import { defineStore } from "pinia";
import { firestore } from "../firebaseResources.js";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  collection,
  addDoc
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

    async followUser(targetUserId) {
      if (!this.user || this.user.id === targetUserId) return;

      const currentUserRef = doc(firestore, "users", this.user.id);
      const targetUserRef = doc(firestore, "users", targetUserId);

      try {
        const targetUserDoc = await getDoc(targetUserRef);
        if (!targetUserDoc.exists()) return;

        const targetUserData = targetUserDoc.data();
        const targetUserPosts = targetUserData.posts || [];

        const currentUserUpdates = {
          following: arrayUnion(targetUserId),
          feed: arrayUnion(...targetUserPosts),
        };

        const targetUserUpdates = {
          followers: arrayUnion(this.user.id),
        };

        await updateDoc(currentUserRef, currentUserUpdates);
        await updateDoc(targetUserRef, targetUserUpdates);

        const notificationsRef = collection(firestore, "notifications");
        await addDoc(notificationsRef, {
          userId: targetUserId,
          message: `${this.user.email} followed you.`,
          timestamp: Date.now()
        });

        // Update local state
        if (!this.user.following) this.user.following = [];
        if (!this.user.following.includes(targetUserId)) {
          this.user.following.push(targetUserId);
        }

        if (!this.user.feed) this.user.feed = [];
        targetUserPosts.forEach((postId) => {
          if (!this.user.feed.includes(postId)) {
            this.user.feed.push(postId);
          }
        });
      } catch (error) {
        throw error;
      }
    },

    async unfollowUser(targetUserId) {
      if (!this.user) return;

      const currentUserRef = doc(firestore, "users", this.user.id);
      const targetUserRef = doc(firestore, "users", targetUserId);

      try {
        const targetUserDoc = await getDoc(targetUserRef);
        if (!targetUserDoc.exists()) return;

        const targetUserData = targetUserDoc.data();
        const targetUserPosts = targetUserData.posts || [];

        const currentUserUpdates = {
          following: arrayRemove(targetUserId),
          feed: arrayRemove(...targetUserPosts),
        };

        const targetUserUpdates = {
          followers: arrayRemove(this.user.id),
        };

        await updateDoc(currentUserRef, currentUserUpdates);
        await updateDoc(targetUserRef, targetUserUpdates);

        // Update local state
        if (this.user.following) {
          this.user.following = this.user.following.filter(
            (id) => id !== targetUserId
          );
        }

        if (this.user.feed) {
          this.user.feed = this.user.feed.filter(
            (postId) => !targetUserPosts.includes(postId)
          );
        }
      } catch (error) {
        throw error;
      }
    },
  },
});
