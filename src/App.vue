<template>
  <header>
      <div class ="navBar">
        <nav>
          <Navigation/>
        </nav>
      </div> 
  </header>

  <Routerview/>
  
  <div class = "login"> 
 
 </div>
</template>

<script setup>
import LoginView from './views/LoginView.vue';
import Navigation from './components/Navigation.vue';
import { RouterLink, RouterView } from 'vue-router';

</script>



<style>

div.navBar {
position: fixed;
top: 0;
left: 0; 

color:blueviolet;
}

</style>
