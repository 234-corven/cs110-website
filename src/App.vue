<template>
  <header>
    <Navigation />
  </header>

  <RouterView />

</template>

<script>
import LoginView from './views/LoginView.vue';
import Navigation from './components/Navigation.vue';
import { RouterLink, RouterView } from 'vue-router';
import Login from './components/Login.vue';
import WhoToFollow from './components/whoToFollow.vue';
import Following from './components/Following.vue';
import ProfileSettings from './components/ProfileSettings.vue';


export default {
  components: {
    Navigation,
    RouterView,
    RouterLink,
    LoginView,
    Login,
    WhoToFollow,
    Following,
    ProfileSettings
  }
}
</script>



<style>
body {
  margin: 0;
  padding: 0;
  overflow-y: auto; 
  height: auto; 
}
</style>
