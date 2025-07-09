<script setup>
import LoginView from './views/LoginView.vue';
import Navigation from './components/Navigation.vue';
</script>



<template>
  <header>
      <div class ="navBar">
        <nav>
          <Navigation/>
        </nav>
      </div> 
  </header>

  <div class = "login"> 
    
  </div>
</template>



<style>

div.navBar {
position: fixed;
top: 0;
left: 0; 

color:blueviolet;
}

</style>
