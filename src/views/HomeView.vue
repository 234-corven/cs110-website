<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import Login from '../components/Login.vue';
import WhoToFollow from '../components/whoToFollow.vue';

import { ref } from 'vue';
</script>

<template>
  <header>
      <div class ="navBar">
        <nav>
          <Navigation/>
        </nav>
      </div> 
  </header>

  <RouterView/>
  
  <div class="frontLoginBox">
    <RouterLink to="/login">Log In</RouterLink>
  </div>

  <div class="postBox">

  </div>

  <div >
    <whoToFollow/>
  </div>

  <RouterView/>


</template>

<style>

div.navBar {
position: fixed;
top: 2%;
left: 2%; 

color:blueviolet;
}

.frontLoginBox {
  position: fixed;
  top: 15%;
  left: 15%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.postBox {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}


</style>
