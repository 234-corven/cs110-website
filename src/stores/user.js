import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => user.value !== null)

  function login(email, password) {
    if (email === 'cneal005@ucr.edu' && password === '234') {
      user.value = {
        email,
        posts: 5,
        following: 5,
        followers: 5,
      }
      return true
    }
    return false
  }

  function logout() {
    user.value = null
  }

  function signup(email, password) {
    user.value = {
      email,
      username: email.split('@')[0],
      posts: 0,
      following: 0,
      followers: 0,
    }
    return true
  }

  return { user, isLoggedIn, login, logout, signup }
})