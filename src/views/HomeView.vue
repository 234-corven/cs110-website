<script setup>
import { RouterLink, RouterView } from 'vue-router';
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


</template>
