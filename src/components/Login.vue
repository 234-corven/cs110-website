<template>
  <div v-if="!userStore.isLoggedIn">
    <div class="backLoginBox">
      <div class="login-buttons">
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
  </div>

  <div class="logoutButton" v-else>
    <div class="logout_user">
      <h2>{{ userStore.user.email }}</h2>
    </div>
    <button class="logout_button" @click="logout">Logout</button>
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
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.login-buttons {
  display: flex;
  justify-content: space-evenly;
  gap: 15px;
  margin-bottom: 10px;
  padding: 10px 0;
}

.login {
  flex: 1;
}

.signup {
  flex: 1;
}

.login h2,
.signup h2 {
  font-size: 30px;
  margin: 0;
  padding: 8px;
}

.login a,
.signup a {
  display: inline-block;
  width: 80%;
  background-color: var(--btn-back-login);
  color: var(--text-white);
  
  text-decoration: none;

  padding: 15px 30px;
  transition: all 0.3s ease;
  
  border-radius: 6px;
  box-shadow: 0 2px 4px var(--shadow-light);
  text-align: center;
}

.login a:hover, .signup a:hover {
  background-color: var(--btn-back-login-hover);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
}

.form-group {
  width: 80%;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/*Email and Password Entry boxes */
.form-group input {
  width: 80%;
  max-width: 300px; 
  padding: 5px;
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
}

/*Entry Box Labels*/
.form-group label {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: bold;
  min-width: 80px;
  text-align: right;
  margin: 0; 
}

/*Submission Button*/
form button {
  width: 80%;
  max-width: 200px; 
  padding: 12px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: 3px;
}

form button:hover {
  background-color: var(--btn-post-hover);
}

form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout_button {
  display: block;
  margin: 20px auto;
  padding: 15px 40px;
  background-color: var(--btn-logout);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.5rem;
}

.logout_user {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
}

.logout_button:hover {
  background-color: var(--btn-logout-hover);
}
</style>
