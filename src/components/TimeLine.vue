<template>
  <div class="timeline-header-container">
    <div class="timeline-header">
      <span>
        <RouterLink class="user-email" v-if="user && user.id" :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
        <span v-if="user && user.email">'s Timeline</span>
      </span>
    </div>
    <div class="timeline-posts-row">
      <template v-if="!isPrivate || canViewPrivatePosts">
        <div class="posts-scroll">
          <Post
            v-for="post in posts"
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
            class="timeline-post"
          />
        </div>
        <div v-if="posts.length === 0" class="timeline-empty">
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
      canViewPrivatePosts: false
    }
  },
  computed: {
    userStore() {
      return useUserStore();
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
  max-width: 1200px;
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
  max-width: 500px;
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
