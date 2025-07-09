<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import Login from '../components/Login.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Feed from '../components/Feed.vue';

import { ref } from 'vue';
</script>

<template>
   
  <div class="frontLoginBox">
    <RouterLink to="/login">Log In</RouterLink>
  </div>

  <Feed/>

  <whoToFollow/>
  
  <RouterView/>

</template>

<style>

.frontLoginBox {
  position: fixed;
  top: 20%;
  left: 15%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}


</style>
