<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import Login from '../components/Login.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Feed from '../components/Feed.vue';
import PostButton from '../components/PostButton.vue';

import { ref } from 'vue';
import UserInfo from '../components/UserInfo.vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const isLoggedIn = ref(userStore.isLoggedIn);

</script>

<template>
  <div class="frontLoginBox">
    <template v-if="!isLoggedIn">
      <RouterLink to="/login">Log In</RouterLink>
    </template>
    <template v-else>
      <div>
        <UserInfo/>
      </div>
    </template>
  </div>

  <PostButton/>

  <Feed/>

  <whoToFollow/>
  
  <RouterView/>

</template>

<style>

.frontLoginBox {
  position: fixed;
  top: 20%;
  left: 20%;
  transform: translate(-50%, -50%);
  width: 200px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}


</style>
