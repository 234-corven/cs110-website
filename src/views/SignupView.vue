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
import { firestore } from '../firebaseResources.js'
import { doc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

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
      this.isLoading = true;
      this.signup(this.email, this.password);
    },

    signup(email, password) {
      if (!email || !password) {
        alert("Please fill in all fields");
        this.isLoading = false;
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        this.isLoading = false;
        return;
      }

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userDoc = {
            email: user.email,
            feed: [],
            followers: [],
            following: [],
            posts: [],
          };

          return setDoc(doc(firestore, "users", user.uid), userDoc);
        })
        .then(() => {
          alert(`Account created for ${email}`);
          this.isLoading = false;
          this.$router.push('/');
        })
        .catch((error) => {
          const errorCode = error.code;
          let errorMessage;

          switch (errorCode) {
            case "auth/email-already-in-use":
              errorMessage =
                "This email is already registered. Use a different email.";
              break;
            case "auth/invalid-email":
              errorMessage = "Enter a valid email address.";
              break;
            case "auth/weak-password":
              errorMessage = "Choose a stronger password.";
              break;
            default:
              errorMessage = "Signup failed: " + error.message;
          }
          alert(errorMessage);
          this.isLoading = false;
        });
    }
  }
}
</script>

<style></style>