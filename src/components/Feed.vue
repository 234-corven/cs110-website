<template>
  <div class="postBox"> 
    Posts
  
  </div>
</template>

<script>
import Post from './Post.vue'
</script>

<style>

.postBox {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

</style>