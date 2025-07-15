<script>
import { useUserStore } from '../stores/user'
import { usePostStore } from '../stores/posts'

export default {
  data() {
    return {
      content: ''
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    postsStore() {
      return usePostStore()
    }
  },
  methods: {
    handlePost() {
      if (this.content.trim() === '') {
        alert('Post cannot be empty.')
        return
      }

      if (!this.userStore.user) {
        alert('You must be logged in to post.')
        return
      }

      const newPost = {
        postID: this.postsStore.posts.length + 1,
        username: this.userStore.user.email,
        id: this.userStore.user.id,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        content: this.content
      }

      this.postsStore.posts.push(newPost)
      this.content = ''

      alert('Post created successfully!')
    }
  }
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