<template>
  <div class="backLoginBox">
    <div v-if="!userStore.isLoggedIn">
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

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email:</label>
          <input type="text" class="form-control" v-model="email" required />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" class="form-control" v-model="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>

    <div class="logoutButton" v-else>
      <div>
        <h2>User: {{ userStore.user.email }}</h2>
      </div>
      <button class="logout_button" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../stores/user";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    async login() {
      const current_user = this.userStore.userList.find(
        (u) => u.email === this.email && u.password === this.password
      );
      if (current_user) {
        this.userStore.user = current_user;
        this.$router.push("/");
      } else {
        alert("Invalid email or password");
      }
    },
    logout() {
      this.userStore.user = null;
      this.$router.push("/");
    },

  },
};
</script>

<style>
.backLoginBox {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login {
  align: left;
}

.signup {
  align: right;
}

.logout_button {
  display: block;
  margin: 20px auto;
  padding: 15px 40px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.5rem;
}
</style>
