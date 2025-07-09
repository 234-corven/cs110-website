<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import HelloWorld from '@/components/HelloWorld.vue';
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

  <HelloWorld/>

</template>
