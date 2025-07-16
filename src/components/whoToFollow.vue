<script>
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';
import { firestore } from '../firebaseResources.js';
import { collection, getDocs, query, limit, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      suggestedUsers: []
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    }
  },
  mounted() {
    this.loadSuggestedUsers();
  },
  methods: {
    loadSuggestedUsers() {
      this.getSuggestedUsers()
        .then((users) => {
          this.suggestedUsers = users;
        });
    },

    getSuggestedUsers() {
      const usersCollection = collection(firestore, "users");

      const randomUsers = query(usersCollection, limit(20));

      return getDocs(randomUsers)
        .then((userSelection) => {
          const users = [];
          userSelection.docs.forEach((document) => {
            users.push({
              id: document.id,
              ...document.data()
            });
          });

          return this.selectRandomUsers(users);
        })
        .catch((error) => {
          return [];
        });
    },

    selectRandomUsers(users) {
      let filteredUsers = users;

      if (this.userStore.user) {
        filteredUsers = users.filter(user => {
          if (user.id === this.userStore.user.id) {
            return false;
          } 

          if (this.userStore.user.following && this.userStore.user.following.includes(user.id)) {
            return false;
          } 

          return true;
        });
      }

      const shuffledUsers = [];
      const remainingUsers = [...filteredUsers];

      while (remainingUsers.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingUsers.length);
        shuffledUsers.push(remainingUsers[randomIndex]);
        remainingUsers.splice(randomIndex, 1);
      }

      return shuffledUsers.slice(0, 5);
    },

    followUser(userId) {
      if (this.userStore.isLoggedIn) {
        if (this.isFollowing(userId)) {
          this.unfollow(userId);
        } else {
          this.follow(userId);
        }
        // Refresh suggestions after follow/unfollow
        this.loadSuggestedUsers();
      } else {
        alert('Please log in to follow users.');
      }
    },
    isFollowing(userId) {
      if (!this.userStore.user) {
        return false;
      } 
      return this.userStore.user.following && this.userStore.user.following.includes(userId);
    },
    getButtonText(userId) {
      return this.isFollowing(userId) ? 'Unfollow' : 'Follow';
    },

    
    follow(userId) {
      if (!this.userStore.user) {
        return;
      }

      const currentUserId = this.userStore.user.id;

      if (currentUserId === userId) {
        return;
      }

      const currentUserRef = doc(firestore, "users", currentUserId);
      const targetUserRef = doc(firestore, "users", userId);

      getDoc(targetUserRef)
        .then((targetUserDoc) => {
          if (!targetUserDoc.exists()) {
            return;
          }

          const targetUserData = targetUserDoc.data();
          const targetUserPosts = targetUserData.posts || [];

          const currentUserUpdates = {
            following: arrayUnion(userId),
            feed: arrayUnion(...targetUserPosts),
          };

          const targetUserUpdates = {
            followers: arrayUnion(currentUserId),
          };

          // Update current user first, then target user
          updateDoc(currentUserRef, currentUserUpdates)
            .then(() => {
              return updateDoc(targetUserRef, targetUserUpdates);
            })
            .then(() => {
              // Update the store state
              if (!this.userStore.user.following.includes(userId)) {
                this.userStore.user.following.push(userId);
                this.userStore.user.feed = [
                  ...(this.userStore.user.feed || []),
                  ...targetUserPosts,
                ];
              }
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    },

    unfollow(targetUserId) {
      if (!this.userStore.user) {
        return;
      }

      const currentUserId = this.userStore.user.id;
      const currentUserRef = doc(firestore, "users", currentUserId);
      const targetUserRef = doc(firestore, "users", targetUserId);

      // Get target user's posts to remove from feed
      getDoc(targetUserRef)
        .then((targetUserDoc) => {
          if (!targetUserDoc.exists()) {
            return;
          }

          const targetUserData = targetUserDoc.data();
          const targetUserPosts = targetUserData.posts || [];

          // Update current user: remove from following array and remove target's posts from feed
          const currentUserUpdates = {
            following: arrayRemove(targetUserId),
            feed: arrayRemove(...targetUserPosts),
          };

          // Update target user: remove current user from followers array
          const targetUserUpdates = {
            followers: arrayRemove(currentUserId),
          };

          // Update current user first, then target user
          updateDoc(currentUserRef, currentUserUpdates)
            .then(() => {
              return updateDoc(targetUserRef, targetUserUpdates);
            })
            .then(() => {
              // Update the store state
              this.userStore.user.following = this.userStore.user.following.filter(
                (id) => id !== targetUserId
              );
              this.userStore.user.feed = (this.userStore.user.feed || []).filter(
                (post) => !targetUserPosts.includes(post)
              );
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    },
  }
}

</script>

<template>
  <div class="whoToFollow">
    <h2>Who to Follow</h2>
    <ul class="to_follow_list">
      <li v-for="current_user in suggestedUsers" :key="current_user.id">
        <RouterLink :to="`/profile/${current_user.id}`">{{ current_user.email }}</RouterLink>

        <template v-if="userStore.isLoggedIn">
          <button class="follow_button" :class="{ 'following': isFollowing(current_user.id) }"
            @click="followUser(current_user.id)">
            {{ getButtonText(current_user.id) }}
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>

<style>
.whoToFollow {
  position: fixed;
  top: 30.90%;
  left: 79.25%;
  transform: translate(-50%, -50%);
  width: 275px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.to_follow_list {
  line-height: 2;
}

.follow_button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  /* Green */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

.follow_button.following {
  background-color: #808080;
  /* Gray */
  cursor: default;
}

.follow_button.following:hover {
  background-color: #808080;
  /* Keep gray on hover */
}
</style>