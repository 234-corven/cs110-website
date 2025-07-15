<script setup> 
import { RouterLink } from 'vue-router';
import userList from '../stores/userList.js';
</script>

<template>
    <div class="whoToFollow">
    <h2>Who to Follow</h2>
    <ul>
      <li v-for="user in userList" :key="user.id">
        <RouterLink :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
      </li>
    </ul>
  
    </div>
</template>

<style>
.whoToFollow {
  position: fixed;
  top: 28%;
  left: 78%;
  transform: translate(-50%, -50%);
  width: 200px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>