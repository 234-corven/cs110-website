<script setup>
import { ref } from 'vue'
const content=ref('')
const handleSubmit = () => {
    if (!content.value.trim()) {
        alert(`Post must not be empty!`)
        return
    }
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
        <button type="button" @click="handleSubmit">Post</button>
    </form>
    
    </div>
    
</template>

<style> 
.createPostBox {
 position: fixed;
  top: 60%;
  left: 20%;
  transform: translate(-50%, -50%);
  width: 200px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>