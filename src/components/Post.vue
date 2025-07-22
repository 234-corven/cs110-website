<template>
  <div class="post" :class="{ 'important-post': isImportant }">
    <div class="post-header">
      <h3 class="post_title" v-if="title">
        <span v-if="isImportant" class="important-star">⭐</span>
        {{ title }}
      </h3>
      <div v-if="isImportant" class="important-badge">Important Event</div>
    </div>
    <div class="post_info">
      <span v-if="userDate" class="user-date">{{ formatUserDate(userDate) }} • </span>
      @<RouterLink :to="`/profile/${userId}`" class="username-link">{{ username }}</RouterLink>
      <span class="submission-info"> • Posted {{ date }} at {{ time }}</span>
    </div>
    <div v-if="isEditing" class="edit-content">
      <input v-model="editTitle" class="edit-title" />
      <textarea v-model="editContent" class="edit-text"></textarea>
      <div class="edit-button-group">
        <button v-if="isEditing" class="edit-button" @click="saveEdit">Save</button>
        <button v-if="isEditing" class="edit-button" @click="cancelEdit">Cancel</button>
      </div>
    </div>
    <div v-else class="post_content" v-html="content"></div>
    <div v-if="canEdit && !isEditing" class="edit-button-group">
      <button class="edit-button" @click="startEdit">Edit</button>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'
import { firestore } from '../firebaseResources.js'
import { doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'Post',
  components: {
    RouterLink
  },
  props: {
    id: {
      type: String,
      required: false
    },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    content: { type: String, required: true },
    title: { type: String, default: '' },
    userDate: { type: String, default: null },
    isImportant: { type: Boolean, default: false }
  },
  data() {
    return {
      isEditing: false,
      editTitle: this.title,
      editContent: this.content
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    canEdit() {
      return this.userStore.user && this.userStore.user.id === this.userId
    }
  },
  methods: {
    formatUserDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    startEdit() {
      this.isEditing = true
      this.editTitle = this.title
      this.editContent = this.content
    },
    async saveEdit() {
      if (!this.id) return
      try {
        const postRef = doc(firestore, "posts", this.id)
        await updateDoc(postRef, {
          title: this.editTitle,
          content: this.editContent
        })
        this.$emit('post-edited', { id: this.id, title: this.editTitle, content: this.editContent })
        this.isEditing = false
      } catch (error) {
        alert("Failed to save changes.")
      }
    },
    cancelEdit() {
      this.isEditing = false
    }
  }
}
</script>

<style>
.post {
  background-color: white !important;
  border: 1px solid var(--post-border);
  border-radius: var(--post-radius);
  padding: var(--post-padding);
  margin-bottom: var(--post-margin);
  box-shadow: var(--post-shadow);
  transition: box-shadow 0.3s ease
}

.post:hover {
  box-shadow: var(--post-shadow-hover);
}

.post_info {
  font-size: 12px;
  color: var(--text-header);
  margin-bottom: 6px;
  font-weight: bold;
}

.user-date {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: normal;
}

.submission-info {
  color: var(--text-secondary);
  font-weight: normal;
  font-size: 10px;
}

.username-link {
  color: var(--link-color);
  text-decoration: none;
}

.username-link:hover {
  text-decoration: none;
}

.post_title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-header);
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.post_content {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;
}

/* Style rich text content */
.post_content b,
.post_content strong {
  font-weight: bold;
}

.post_content i,
.post_content em {
  font-style: italic;
}

.post_content u {
  text-decoration: underline;
}

.post_content s {
  text-decoration: line-through;
}

.post_content ul {
  margin: 4px 0;
  padding-left: 20px;
}

.post_content ol {
  margin: 4px 0;
  padding-left: 20px;
}

.post_content a {
  color: var(--link-color);
  text-decoration: underline;
}

.post_content a:hover {
  color: var(--link-hover);
}

.post_content [style*="text-align: center"] {
  text-align: center;
}

.post_content [style*="text-align: right"] {
  text-align: right;
}

.post_content [style*="text-align: left"] {
  text-align: left;
}

.important-post {
  border-left: 4px solid #ff6b6b !important;
  border-top: 1px solid #ff6b6b !important;
  border-right: 1px solid #ff6b6b !important;
  border-bottom: 1px solid #ff6b6b !important;
  background-color: #f29797 !important;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.important-star {
  color: #ffd700;
  margin-right: 6px;
}

.important-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff8a80) !important;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}

.edit-button {
  margin-left: 10px;
  padding: 3px 10px;
  font-size: 12px;
  background: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background: var(--btn-post-hover);
}

.edit-button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.edit-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  position: relative;
}

.edit-title {
  font-size: 18px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-primary);
}

.edit-text {
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-primary);
  min-height: 60px;
  resize: vertical;
}
</style>