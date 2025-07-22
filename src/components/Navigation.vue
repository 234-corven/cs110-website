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
<div class = "navigation">
  <img class="logo" src="../components/icons/250x250.jpg">
  <RouterLink to="/">Home</RouterLink>

  <div v-if="!userStore.isLoggedIn">
    <RouterLink to="/login">Log In</RouterLink>
  </div>
  <div v-else>
    <RouterLink to="/login">Log Out</RouterLink>
  </div>
</div>
</template>

<style> 
.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px; 
  background-color: #E1D05C;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  box-sizing: border-box;
  position: fixed; 
  top: 0;
  left: 0;
  z-index: 1000; 
  gap: 30px; 
}

.logo {
  height: 50px; 
  width: auto; 
  border: #000 solid 1px;  
  border-radius: 50%; 
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 24px; 
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background-color: #e9ecef;
}
</style>