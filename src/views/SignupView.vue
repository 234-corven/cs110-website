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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

function handleSignup() {
  if (email.value && password.value) {
    userStore.signup(email.value, password.value)
    router.push('/')
    alert(`Signup with email: ${email.value} and password: ${password.value}`)
  } else {
    alert('Please fill in all fields')
  }
}
</script>

<style></style>