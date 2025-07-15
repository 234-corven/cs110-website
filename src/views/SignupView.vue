<template>
  <div class="backLoginBox">
    <div class="login">
      <h2>
        <RouterLink to="/login">Login</RouterLink>
      </h2>
    </div>
    <div class="signup">
      <h2>
        <RouterLink to="/signup">Sign Up</RouterLink>
      </h2>
    </div>

    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label>Email:</label>
        <input type="text" class="form-control" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" v-model="password" required>
      </div>
      <button type="submit">Sign Up</button>
    </form>

  </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  methods: {
    handleSignup() {
      if (this.email && this.password) {
        this.userStore.signup(this.email, this.password)
        this.$router.push('/')
        alert(`Signup with email: ${this.email} and password: ${this.password}`)
      } else {
        alert('Please fill in all fields')
      }
    }
  }
}
</script>

<style></style>