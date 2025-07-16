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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  methods: {
    handleSignup() {
      if (!this.email || !this.password) {
        alert('Please fill in all fields')
        return
      }

      if (this.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return
      }

      this.isLoading = true

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userLogin) => {
          const user = userLogin.user;
          this.userStore.signup(this.email, this.password)

          alert(`Account created for ${this.email}`)
          this.$router.push('/')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          
          switch (errorCode) {
            case 'auth/email-already-in-use':
              alert('This email is already registered. Please use a different email.')
              break
            case 'auth/invalid-email':
              alert('Enter a valid email address.')
              break
            case 'auth/weak-password':
              alert('Choose a stronger password.')
              break
            default:
              alert('Signup failed: ' + errorMessage)
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style></style>