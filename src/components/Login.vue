<template>
  <div class="backLoginBox">
    <div class="login">
        <h2><RouterLink to="/login">Login</RouterLink></h2>
    </div>
    <div class="signup">
        <h2><RouterLink to="/signup">Sign Up</RouterLink></h2>
    </div>
    
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email:</label>
        <input type="text" class="form-control" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" v-model="password" required>
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

import userList from '../stores/userList.js';

const login = async () => {
  const user = userList.find(
    u => u.email === email.value && u.password === password.value
  );
  if (user) {
    router.push('/');
  } else {
    alert('Invalid email or password');
  }
};

</script>

<style>

.backLoginBox {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.login {
    align:left
}

.signup {
    align:right
}


</style>