<script setup> 

</script>

<template>

    <div class="whoToFollow">
    <h2>Who to Follow</h2>
    <ul>
      <li><RouterLink to="/profile/1">User 1</RouterLink></li>
      <li><RouterLink to="/profile/2">User 2</RouterLink></li>
      <li><RouterLink to="/profile/3">User 3</RouterLink></li>
    </ul>
  
    </div>
</template>

<style>
.whoToFollow {
  position: fixed;
  top: 20%;
  left: 85%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>