<script>
import { useUserStore } from '../stores/user'
import { firestore } from '../firebaseResources.js'
import { collection, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore'
import RichTextEditor from './RichTextEditor.vue'

export default {
  data() {
    return {
      content: '',
      title: '',
      userDate: '', // User-specified date
      isImportant: false, 
      activeCommands: [],
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  mounted() {
    document.addEventListener('selectionchange', this.updateActiveCommands);
  },
  beforeUnmount() {
    document.removeEventListener('selectionchange', this.updateActiveCommands);
  },
  methods: {
    updateActiveCommands() {
      if (!this.$refs.editor) return;
      if (document.activeElement !== this.$refs.editor) return;
      const commands = [
        'bold', 'italic', 'underline', 'strikeThrough',
        'justifyLeft', 'justifyCenter', 'justifyRight',
        'insertOrderedList', 'insertUnorderedList'
      ];
      this.activeCommands = commands.filter(cmd => document.queryCommandState(cmd));
    },

    isActive(command) {
      return this.activeCommands.includes(command);
    },

    formatText(command, value = null) {
      if (!this.$refs.editor) return;
      document.execCommand(command, false, value);
      this.$refs.editor.focus();
   
      this.updateActiveCommands();
    },

    toggleFormat(command, value = null) {
      this.formatText(command, value);
    },

    insertLink() {
      const url = prompt('Enter URL:');
      if (url) {
        this.formatText('createLink', url);
      }
    },

    changeFontSize() {
      const size = prompt('Enter font size (1-7):');
      if (size && size >= 1 && size <= 7) {
        this.formatText('fontSize', size);
      }
    },

    changeTextColor() {
      const color = prompt('Enter color (e.g., red, #ff0000):');
      if (color) {
        this.formatText('foreColor', color);
      }
    },

    handlePost() {
      const plainText = this.content.replace(/<[^>]+>/g, '').trim();
      const titleText = this.title.trim();
      
      if (plainText && titleText) {
        this.createPost(this.content, this.title, this.userDate, this.isImportant);
        this.content = '';
        this.title = '';
        this.userDate = '';
        this.isImportant = false;
      } else {
        alert("Both title and content are required.");
      }
    },

    async createPost(content, title, userDate, isImportant) {
      if (!this.userStore.user) {
        alert("You must be logged in to post.");
        return;
      }

      const postsCollection = collection(firestore, "posts");
      const newPost = {
        timestamp: serverTimestamp(),
        author: this.userStore.user.id,
        title: title.trim(),
        content: content.trim(),
        userDate: userDate || null,
        isImportant: isImportant || false,
      };

      try {
        const postDocRef = await addDoc(postsCollection, newPost);
        const postId = postDocRef.id;

        const currentUserRef = doc(firestore, "users", this.userStore.user.id);
        await updateDoc(currentUserRef, {
          posts: arrayUnion(postId),
          feed: arrayUnion(postId)
        });

        this.userStore.user.posts = [...(this.userStore.user.posts || []), postId];
        this.userStore.user.feed = [...(this.userStore.user.feed || []), postId];

        this.addPostToFollowersFeeds(postId);

        // Add notifications for all followers
        if (this.userStore.user.followers && this.userStore.user.followers.length > 0) {
          const notificationsRef = collection(firestore, "notifications");
          const promises = this.userStore.user.followers.map(followerId => {
            return addDoc(notificationsRef, {
              userId: followerId,
              postId: postId,
              authorId: this.userStore.user.id,
              authorEmail: this.userStore.user.email,
              message: `${this.userStore.user.email} made a new post.`,
              timestamp: Date.now()
            });
          });
          await Promise.all(promises);
        }

        window.dispatchEvent(new CustomEvent('postCreated'));
        alert("Post created successfully!");
      } catch (error) {
        alert("Failed to create post. Please try again.");
      }
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
    },
  },
  components: {
    RichTextEditor
  }
}
</script>

<template>
  <div class="createPostBox">
    <h1>Create a Post</h1>
    <form class="PostInput">
      <input 
        v-model="title" 
        type="text" 
        placeholder="Post title..." 
        class="title-input"
        required
      />
      <input 
        v-model="userDate" 
        type="date" 
        class="date-input"
        title="Optional: Specify a date for this post"
        placeholder="Post date (optional)"
      />
     <div class = "post-input-div">
        <RichTextEditor 
        v-model="content"
        :placeholder="'What are you pondering?'"
        :editorClass="'rich-editor'"
        class = "post-input"
      />
     </div>
      <div class="important-checkbox">
        <input 
          v-model="isImportant" 
          type="checkbox" 
          id="important-check"
          class="checkbox-input"
        />
        <label for="important-check" class="checkbox-label">
          ⭐ Mark as Important Event
        </label>
      </div>
      <button class="post_button" type="button" @click="handlePost">Post</button>
    </form>
  </div>
</template>

<style scoped>
.createPostBox {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 12px; 
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.createPostBox h1 {
  margin-top: 0;
  margin-bottom: 4px; 
}

.PostInput {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.title-input,
.date-input,
.rich-editor,
.important-checkbox,
.post_button {
  margin-bottom: 0px;
  margin-top: 0px; 
}

.title-input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  margin-bottom: 0px;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;
}

.title-input:focus,
.date-input:focus {
  outline: none;
  border-color: var(--primary);
}

.date-input {
  width: 100%;
  padding: 8px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  margin-bottom: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

/** Post Input */
.post-input-div {
  width: 100%;
  min-height: 80px !important;
}

.separator {
  color: var(--border-primary);
  margin: 0 3px;
  font-size: 12px;
}

.post_button {
  align-self: flex-end;
  width: 20%;
  padding: 8px 16px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0;
}

.post_button:hover {
  background-color: var(--btn-post-hover);
}

.important-checkbox {
  display: flex;
  width: 94.5%;
  align-items: center;
  margin-bottom: 4px;
  padding: 10px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  border: 2px solid var(--border-primary);
}

.checkbox-input {
  margin-right: 8px;
  transform: scale(1.2);
}

.checkbox-label {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}
</style>