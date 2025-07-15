<template>
  <div class="postBox"> 
    <div class="post_header">Posts</div>
    <Post
        v-for="current_post in postStore.posts.slice(0, 9)"
        :key="current_post.id"
        :username="current_post.username"
        :date="current_post.date"
        :time="current_post.time"
        :content="current_post.content"
      />
  </div>
</template>

<script setup>
import Post from './Post.vue'
import { usePostStore } from '../stores/posts.js'
const postStore = usePostStore();
</script>

<style>

.postBox {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.post_header {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>