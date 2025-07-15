<template>
<header>
      <div class ="navBar">
        <nav>
          <Navigation/>
        </nav>
      </div> 
  </header>

  <UserInfo/>
  <Feed/>

  <whoToFollow/>
  <PostButton/>

  <RouterView/>

</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import Login from '../components/Login.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Feed from '../components/Feed.vue';
import { ref, computed } from 'vue';
import userList from '../stores/userList.js';
import UserInfo from '../components/UserInfo.vue';

const route = useRoute();
const userID = route.params.id;
const user = computed(() => userList.find(u => u.email === userEmail));
</script>

<style>

</style>