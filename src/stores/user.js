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
        following: [],
        followers: [],
        isLoggedIn: false,
      },
      {
        id: 2,
        email: "fake@gmail.com",
        password: "1",
        posts: 5,
        following: [],
        followers: [],
        isLoggedIn: false,
      },
      {
        id: 3,
        email: "real@gmail.com",
        password: "2",
        posts: 10,
        following: [],
        followers: [],
        isLoggedIn: false,
      },
      {
        id: 4,
        email: "legit@gmail.com",
        password: "3",
        posts: 15,
        following: [],
        followers: [],
        isLoggedIn: false,
      },
      {
        id: 5,
        email: "fraud@gmail.com",
        password: "4",
        posts: 1,
        following: [],
        followers: [],
        isLoggedIn: false,
      },
    ],
  }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
    getUserById: (state) => (id) => {
      return state.userList.find(user => user.id === id);
    },
    getFollowingCount: (state) => (userId) => {
      const user = state.userList.find(u => u.id === userId);
      return user ? user.following.length : 0;
    },
    getFollowersCount: (state) => (userId) => {
      const user = state.userList.find(u => u.id === userId);
      return user ? user.followers.length : 0;
    }
  },
  actions: {
    login(email, password) {
      const user = this.userList.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        this.user = user;
        return true;
      }
      return false;
    },
    logout() {
      this.user = null;
    },
    follow(userId) {
      if (!this.user) {
        console.log('No user logged in');
        return;
      }
      
      const currentUser = this.userList.find((u) => u.id === this.user.id);
      const followedUser = this.userList.find((u) => u.id === userId);
      
      if (currentUser && followedUser && currentUser.id !== followedUser.id) {
        if (!currentUser.following.includes(followedUser.id)) {
          currentUser.following.push(followedUser.id);
          followedUser.followers.push(currentUser.id);
          console.log(`${currentUser.email} is now following ${followedUser.email}`);
        } else {
          console.log('Already following this user');
        }
      }
    },
    signup(email, password) {
      const newUser = {
        id: this.userList.length + 1,
        email,
        password,
        username: email.split("@")[0],
        posts: 0,
        following: [],
        followers: [],
        isLoggedIn: false,
      };
      this.userList.push(newUser);
      this.user = newUser;
      return true;
    },
  },
});
