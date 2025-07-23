<template>
  <div class="timeline-header-container">
    <div class="timeline-header">
      <span>
        <RouterLink class="user-email" v-if="user && user.id" :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
        <span v-if="user && user.email">'s Timeline</span>
      </span>
      <div class="timeline-controls">
        <select v-model="sortOrder" class="timeline-sort-dropdown">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <select v-model="sortField" class="timeline-sort-dropdown">
          <option value="timestamp">Post Date</option>
          <option value="userDate">User Date</option>
        </select>
        <label class="important-filter-label">
          <input type="checkbox" v-model="importantOnly" class="important-filter-checkbox" />
          Only Important
        </label>
      </div>
    </div>
    <div class="timeline-posts-row">
      <template v-if="!isPrivate || canViewPrivatePosts">
        <div class="posts-scroll">
          <Post
            v-for="post in filteredSortedPosts"
            :key="post.id"
            :id="post.id"
            :username="user.email"
            :userId="user.id"
            :title="post.title"
            :date="formatDate(post.timestamp)"
            :time="formatTime(post.timestamp)"
            :userDate="post.userDate"
            :isImportant="post.isImportant"
            :content="post.content"
            :editedAt="post.editedAt"
            :timestamp="post.timestamp"
            class="timeline-post"
          />
        </div>
        <div v-if="filteredSortedPosts.length === 0" class="timeline-empty">
          No posts yet.
        </div>
      </template>
      <template v-else>
        <div class="private-feed-message">
          This user's posts are private and only visible to followers.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '../firebaseResources.js'
import Post from './Post.vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  name: 'TimeLine',
  components: { RouterLink, Post },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      posts: [],
      isPrivate: false,
      canViewPrivatePosts: false,
      sortOrder: 'desc',
      sortField: 'timestamp',
      importantOnly: false
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    filteredSortedPosts() {
      let filtered = this.posts;
      if (this.importantOnly) {
        filtered = filtered.filter(post => post.isImportant);
      }
      return [...filtered].sort((a, b) => {
        let aValue, bValue;
        if (this.sortField === 'userDate') {
          aValue = a.userDate ? new Date(a.userDate).getTime() : 0;
          bValue = b.userDate ? new Date(b.userDate).getTime() : 0;
        } else {
          aValue = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : (a.timestamp || 0);
          bValue = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : (b.timestamp || 0);
        }
        return this.sortOrder === 'desc'
          ? bValue - aValue
          : aValue - bValue;
      });
    }
  },
  watch: {
    user: {
      handler(newUser) {
        this.loadPosts(newUser);
      },
      immediate: true
    }
  },
  methods: {
    async loadPosts(user) {
      if (!user || !user.id) {
        this.posts = [];
        this.isPrivate = false;
        this.canViewPrivatePosts = false;
        return;
      }
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        this.posts = [];
        this.isPrivate = false;
        this.canViewPrivatePosts = false;
        return;
      }
      const userData = userDoc.data();
      this.isPrivate = !!userData.isPrivate;
      const isOwner = this.userStore.user && this.userStore.user.id === user.id;
      const isFollower = this.userStore.user && userData.followers && userData.followers.includes(this.userStore.user.id);
      this.canViewPrivatePosts = isOwner || isFollower;

      if (this.isPrivate && !this.canViewPrivatePosts) {
        this.posts = [];
        return;
      }

      const postIds = userData.posts || [];
      if (postIds.length === 0) {
        this.posts = [];
        return;
      }
      const postPromises = postIds.map(postId => {
        const postRef = doc(firestore, "posts", postId);
        return getDoc(postRef)
          .then(postDoc => postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null)
          .catch(() => null);
      });
      const posts = await Promise.all(postPromises);
      this.posts = posts.filter(post => post !== null);
    },
    formatDate(timestamp) {
      if (timestamp && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString().slice(0, 10);
      }
      return timestamp ? new Date(timestamp).toISOString().slice(0, 10) : '';
    },
    formatTime(timestamp) {
      if (timestamp && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleTimeString('en-US');
      }
      return timestamp ? new Date(timestamp).toLocaleTimeString('en-US') : '';
    }
  }
}
</script>

<style scoped>
.timeline-header-container {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow-light);
  padding: 24px 32px;
}

.timeline-header {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 18px;
  color: var(--text-header);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 18px;
}

.timeline-sort-dropdown {
  font-size: 16px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-primary);
  background: var(--bg-white);
  color: var(--text-header);
}

.important-filter-label {
  font-size: 16px;
  font-weight: normal;
  color: var(--text-header);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}

.important-filter-checkbox {
  margin-right: 4px;
  transform: scale(1.2);
}

.timeline-posts-row {
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: row;
}

.posts-scroll {
  display: flex;
  flex-direction: row;
  gap: 18px;
  overflow-x: auto;
  width: 100%;
  padding-bottom: 8px;
}

.timeline-post {
  min-width: 350px;
  max-width: 600px;
  flex: 0 0 auto;
}

.user-email a,
.user-email a:visited {
    color: var(--link-color);
    text-decoration: none;
}

.user-email a:hover {
    color: var(--link-hover);
    text-decoration: none;
}

.timeline-empty {
  font-size: 18px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 0px;
}

.private-feed-message {
  color: var(--text-primary);
  font-style: italic;
  text-align: left;
  font-size: 16px;
}
</style>
