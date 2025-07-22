<script>
import { useUserStore } from '../stores/user'
import { firestore } from '../firebaseResources.js'
import { collection, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore'

export default {
  data() {
    return {
      content: ''
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  methods: {
    handlePost() {
      this.createPost(this.content);
      this.content = '';
    },

    createPost(content) {
      if (!this.userStore.user) {
        alert("You must be logged in to post.");
        return;
      }

      if (!content || content.trim() === "") {
        alert("Post cannot be empty.");
        return;
      }

      const postsCollection = collection(firestore, "posts");
      const newPost = {
        timestamp: serverTimestamp(),
        author: this.userStore.user.id,
        content: content.trim(),
      };

      addDoc(postsCollection, newPost)
        .then((postDocRef) => {
          const postId = postDocRef.id;

          const currentUserRef = doc(firestore, "users", this.userStore.user.id);
          updateDoc(currentUserRef, {
            posts: arrayUnion(postId),
            feed: arrayUnion(postId)  
          })
            .then(() => {
              this.userStore.user.posts = [...(this.userStore.user.posts || []), postId];
              this.userStore.user.feed = [...(this.userStore.user.feed || []), postId];  // Update local feed too

              this.addPostToFollowersFeeds(postId);

              // Emit event to refresh the feed
              window.dispatchEvent(new CustomEvent('postCreated'));

              alert("Post created successfully!");
            })
            .catch((error) => {
              alert("Failed to update user posts. Please try again.");
            });
        })
        .catch((error) => {
          alert("Failed to create post. Please try again.");
        });
    },

    addPostToFollowersFeeds(postId) {
      if (!this.userStore.user.followers || this.userStore.user.followers.length === 0) {
        return;
      }

      this.userStore.user.followers.forEach((followerId) => {
        const followerRef = doc(firestore, "users", followerId);
        updateDoc(followerRef, {
          feed: arrayUnion(postId),
        }).catch((error) => {});
      });
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
  display: flex;
  flex-direction: column;
  width: 250px;
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.post_button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>