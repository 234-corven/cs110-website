<script setup> 
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<template>
  <img class="logo" src="../components/icons/50x50.jpg">
  <RouterLink to="/">Home</RouterLink>

  <template v-if="!userStore.isLoggedIn">
    <RouterLink to="/login">Log In</RouterLink>
  </template>
  <template v-else>
    <RouterLink to="/login">Log Out</RouterLink>
  </template>

</template>

<style>
RouterLink {
    text-align:top;
}

 .logo {
    float: left;
    width: 25%;
 }

</style>