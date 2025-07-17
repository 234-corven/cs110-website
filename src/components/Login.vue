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
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
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
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      isLoading: false
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    login() {
      if (!this.email || !this.password) {
        alert('Please fill in all fields');
        return;
      }

      this.isLoading = true;

      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userLogin) => {
          const user = userLogin.user;
          this.loadUserData(user.uid);

          alert(`Welcome, ${this.email}!`);
          this.$router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          switch (errorCode) {
            case 'auth/user-not-found':
              alert('No account found with this email address.');
              break;
            case 'auth/wrong-password':
              alert('Incorrect password. Try again.');
              break;
            case 'auth/invalid-email':
              alert('Enter a valid email address.');
              break;
            default:
              alert('Login failed: ' + errorMessage);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    loadUserData(userId) {
      this.userStore.getUserById(userId)
        .then((userData) => {
          if (userData) {
            this.userStore.user = userData;
          }
        })
        .catch((error) => {
          console.error("Error loading user data:", error);
        });
    },

    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.userStore.user = null;
        alert('You have been logged out successfully.');
        this.$router.push("/");
      }).catch((error) => {
        alert('Error logging out: ' + error.message);
      });
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
  text-align: left;
}

.signup {
  text-align: left;
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
