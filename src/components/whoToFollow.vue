<script>
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';

export default {
  components: {
    RouterLink
  },
  computed: {
    userStore() {
      return useUserStore();
    }
  },
  methods: {
    followUser(userId) {
      if (this.userStore.isLoggedIn) {
        this.userStore.follow(userId);
      } else {
        alert('Please log in to follow users.');
      }
    },
    isFollowing(userId) {
      if (!this.userStore.user) return false;
      return this.userStore.user.following.includes(userId);
    },
    getButtonText(userId) {
      return this.isFollowing(userId) ? 'Following' : 'Follow';
    }
  }
}
</script>

<template>
    <div class="whoToFollow">
      <h2>Who to Follow</h2>
        <ul class="to_follow_list">
          <li v-for="current_user in userStore.userList.filter(user => !userStore.user || user.id !== userStore.user.id)" :key="current_user.id">
            <RouterLink :to="`/profile/${current_user.id}`">{{ current_user.email }}</RouterLink>
          
            <template v-if="userStore.isLoggedIn" >
              <button 
                class="follow_button" 
                :class="{ 'following': isFollowing(current_user.id) }"
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.to_follow_list {
  line-height: 2;
}

.follow_button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4CAF50; /* Green */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

.follow_button.following {
  background-color: #808080; /* Gray */
  cursor: default;
}

.follow_button.following:hover {
  background-color: #808080; /* Keep gray on hover */
}
</style>