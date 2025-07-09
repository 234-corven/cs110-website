<template>
  <div class="backLoginBox">
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email:</label>
        <input type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" class="form-control" required>
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
export default{};
</script>

<style>

.backLoginBox {
  position: fixed;
  top: 15%;
  left: 15%;
  transform: translate(-50%, -50%);
  width: 500px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}


</style>