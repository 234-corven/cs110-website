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

<template class = "navigation">
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
.navigation {
  z-index: 10;
}
RouterLink {
  text-align: top;
}

.logo {
  float: left;
  width: 25%;
}
</style>