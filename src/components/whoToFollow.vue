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
  watch: {
    'userStore.user.following': {
      handler(newFollowing, oldFollowing) {
        if (this.suggestedUsers.length === 0) {
          this.loadSuggestedUsers();
          return;
        }
        
        // If someone was unfollowed, reload suggestions
        if (oldFollowing && newFollowing && newFollowing.length < oldFollowing.length) {
          this.loadSuggestedUsers();
        }
      },
      deep: true
    }
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
        this.follow(userId);
        // Remove the followed user from suggestions instead of reloading
        this.suggestedUsers = this.suggestedUsers.filter(user => user.id !== userId);
        
      } else {
        alert('Please log in to follow users.');
      }
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
              // Update the store state - ensure arrays exist and avoid duplicates
              if (!this.userStore.user.following) {
                this.userStore.user.following = [];
              }
              if (!this.userStore.user.following.includes(userId)) {
                this.userStore.user.following.push(userId);
              }

              if (!this.userStore.user.feed) {
                this.userStore.user.feed = [];
              }
              // Add new posts to feed, avoiding duplicates
              targetUserPosts.forEach(postId => {
                if (!this.userStore.user.feed.includes(postId)) {
                  this.userStore.user.feed.push(postId);
                }
              });

            })
            .catch((error) => {
            });
        })
        .catch((error) => {
        });
    }
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
          <button class="follow_button" @click="followUser(current_user.id)">
            Follow
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>

<style>
.whoToFollow {
  display: flex;
  flex-direction: column;
  width: 275px;
  padding: 20px;
  background-color:  var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.to_follow_list {
  line-height: 2;
}

.to_follow_list a {
  color: var(--link-color);
  text-decoration: none;
}

.to_follow_list a:hover {
  color: var(--link-hover);
}

.follow_button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: var(--btn-follow);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

.follow_button:hover {
  background-color: var(--btn-follow-hover);
}

</style>