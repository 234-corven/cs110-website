import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    userList: [
      {
        id: 1,
        email: "cneal005@ucr.edu",
        password: "234",
        posts: 2,
        following: 2,
        followers: 2,
        isLoggedIn: false,
      },
      {
        id: 2,
        email: "fake@gmail.com",
        password: "1",
        posts: 5,
        following: 5,
        followers: 5,
        isLoggedIn: false,
      },
      {
        id: 3,
        email: "real@gmail.com",
        password: "2",
        posts: 10,
        following: 10,
        followers: 10,
        isLoggedIn: false,
      },
      {
        id: 4,
        email: "legit@gmail.com",
        password: "3",
        posts: 15,
        following: 15,
        followers: 15,
        isLoggedIn: false,
      },
      {
        id: 5,
        email: "fraud@gmail.com",
        password: "4",
        posts: 1,
        following: 0,
        followers: 0,
        isLoggedIn: false,
      },
    ],
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
  },
  actions: {
    follow(userId) {
      const currentUser = this.userList.find((u) => u.id === this.user.id);
      const followedUser = this.userList.find((u) => u.id === userId);
      if (currentUser && followedUser) {
        if (!currentUser.following.includes(followedUser.id)) {
          currentUser.following.push(followedUser.id);
          followedUser.followers.push(currentUser.id);
        }
      }
    },
  },
});
