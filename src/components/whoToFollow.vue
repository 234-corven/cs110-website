<script>
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';
import { firestore } from '../firebaseResources.js';
import { collection, getDocs, query, limit } from 'firebase/firestore';

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

    async followUser(userId) {
      if (this.userStore.isLoggedIn) {
        try {
          await this.userStore.followUser(userId);
          // Remove the followed user from suggestions
          this.suggestedUsers = this.suggestedUsers.filter(user => user.id !== userId);
        } catch (error) {
          console.error('Error following user:', error);
        }
      } else {
        alert('Please log in to follow users.');
      }
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
  padding: 10px 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.whoToFollow h2 {
  margin-top: 0;
  margin-bottom: 3px;
  font-size: 25px;
  padding-bottom: 4px;
  color: var(--text-header);
  border-bottom: 2px solid var(--text-header);
}

.to_follow_list {
  line-height: 2;
  list-style: none;
  padding: 0;
  margin: 0;
}

.to_follow_list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 4px;
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