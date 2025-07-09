<template>
    <div class="backLoginBox">
    <div class="login">
        <h2><RouterLink to="/login">Login</RouterLink></h2>
    </div>
    <div class="signup">
        <h2><RouterLink to="/signup">Sign Up</RouterLink></h2>
    </div>

     <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label>Email:</label>
        <input type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" required>
      </div>
      <button type="submit">Sign Up</button>
    </form>

    </div>
</template>

<script>


function handleSignup() {
  if (email.value && password.value) {
    userStore.signup(email.value, password.value)
    router.push('/')
  } else {
    alert('Please fill in all fields')
  }
}
</script>

<style>

</style>