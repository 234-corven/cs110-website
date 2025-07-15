<script setup>
import { ref } from 'vue'
const content = ref('')

const handlePost = () => {
  if (content.value.trim() === '') {
    alert('Post cannot be empty.')
    return
  }

  store.posts.push({
    id: store.posts.length + 1,
    username: store.currentUser,
    userId: store.users.find(u => u.username === store.currentUser)?.id,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString(),
    content: content.value
  })
  content.value = ''
}

</script>

<template>
  <div class="createPostBox">
    <h1>
      Create a Post
    </h1>
    <form class="PostInput">
      <input type="text" v-model="content" placeholder="What are you pondering?" />
      <button class="post_button" type="button" @click="handlePost">Post</button>
    </form>

  </div>

</template>

<style>
.createPostBox {
  position: fixed;
  top: 39%;
  left: 18%;
  transform: translate(-50%, -50%);
  width: 225px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.post_button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  /* Green */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>