<script setup> 
import { RouterLink } from 'vue-router';
import userList from '../stores/userList.js';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<template>
    <div class="whoToFollow">
      <h2>Who to Follow</h2>
        <ul class="to_follow_list">
          <li v-for="user in userList" :key="user.id">
            <RouterLink :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
          
            <template v-if="userStore.isLoggedIn" >
              <button class="follow_button" @click="followUser(user.id)">Follow</button>
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
</style>