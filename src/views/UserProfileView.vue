<template>
<header>
      <div class ="navBar">
        <nav>
          <Navigation/>
        </nav>
      </div> 
</header>

  <UserInfo :user="userPage"/>
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
import PostButton from '../components/PostButton.vue';
import { useUserStore } from '../stores/user';
const userStore = useUserStore();

const route = useRoute();

const user = user.find(u => u.email === route.params.email)
const userPosts = user ? posts.filter(post => post.author === user.id) : []

const userID = user.find(u => u.id === route.params.id)
const userPage = computed(() => userList.find(u => u.id == userID));

</script>

<style>

</style>