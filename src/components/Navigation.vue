<script>
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  components: {
    RouterLink
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  }
}
</script>

<template>
<div class="navigation">
  <div class="logo-section">
    <img class="logo" src="../components/icons/250x250.jpg">
  </div>
  
  <div class="nav-links">
    <RouterLink to="/">Home</RouterLink>
    <div v-if="!userStore.isLoggedIn">
      <RouterLink to="/login">Log In</RouterLink>
    </div>
    <div v-else>
      <RouterLink to="/login">Log Out</RouterLink>
    </div>
  </div>
</div>
</template>

<style> 
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px; 
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  padding: 0 20px;
  box-sizing: border-box;
  position: fixed; 
  top: 0;
  left: 0;
  z-index: 1000; 
  gap: 30px; 
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 60px; 
  width: auto; 
  border:  var(--border-dark) solid 1px;  
  border-radius: 50%; 
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1; 
  justify-content: center; 
}
 
.navigation a {
  text-decoration: none;
  color: var(--text-header);
  font-weight: bold;
  font-size: 24px; 
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background-color: var(--primary-hover);
}
</style>