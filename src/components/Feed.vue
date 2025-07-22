<template>
  <div class="postBox">
    <div class="post_header">{{ headerText }}</div>
    <Post v-for="current_post in displayPosts" :key="current_post.id" 
      :username="current_post.authorEmail"
      :userId="current_post.authorId" 
      :date="formatDate(current_post.timestamp)" 
      :time="formatTime(current_post.timestamp)"
      :content="current_post.content" />
    <div v-if="displayPosts.length === 0">
      {{ userId ? 'This user hasn\'t posted anything yet.' : 'No posts available.' }}
    </div>
  </div>
</template>

<script>
import Post from './Post.vue'
import { useUserStore } from '../stores/user.js'
import { firestore } from '../firebaseResources.js'
import { collection, getDocs, doc, getDoc, query, limit, orderBy } from 'firebase/firestore'

export default {
  components: {
    Post
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    userEmail: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      displayPosts: []
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    },
    isLoggedIn() {
      return this.userStore.isLoggedIn
    },
    headerText() {
      if (this.userId && this.userEmail) {
        return this.userEmail;
      }
      return 'Recent Posts';
    }
  },
  mounted() {
    this.loadPosts();
    // looks for new posts created by the user
    window.addEventListener('postCreated', this.loadPosts);
  },
  beforeUnmount() {
    window.removeEventListener('postCreated', this.loadPosts);
  },
  watch: {
    isLoggedIn() {
      this.loadPosts();
    },
    userId() {
      this.loadPosts();
    },
    'userStore.user.following': {
      handler() {
        // Refresh feed when following list changes
        this.loadPosts();
      },
      deep: true
    }
  },
  methods: {
    getEmptyArray() {
      return Promise.resolve([]);
    },

    loadPosts() {
      this.getDisplayPosts()
        .then((posts) => {
          this.addAuthor(posts);
        });
    },

    getDisplayPosts() {
      if (this.userId) {
        return this.getUserPosts();
      }

      if (this.isLoggedIn) {
        // If logged in and on home feed, show posts from followed users only
        return this.getFeedPosts();
      }

      // If not logged in, show recent posts from everyone
      return this.getRecentPosts();
    },

    getFeedPosts() {
      if (!this.userStore.user || !this.userStore.user.feed) {
        return this.getEmptyArray();
      }

      const feedPostIds = this.userStore.user.feed || [];

      if (feedPostIds.length === 0) {
        return this.getEmptyArray();
      }

      // Get all posts in parallel
      const postToShow = feedPostIds.map(postId => {
        const postRef = doc(firestore, "posts", postId);
        return getDoc(postRef)
          .then((postDoc) => {
            if (postDoc.exists()) {
              return {
                id: postDoc.id,
                ...postDoc.data(),
              };
            }
            return null;
          })
          .catch(() => null);
      });

      return Promise.all(postToShow)
        .then((posts) => {
          const validPosts = posts
            .filter(post => post !== null && post.timestamp)
            .sort((a, b) => {
              const aTime = a.timestamp.seconds || a.timestamp;
              const bTime = b.timestamp.seconds || b.timestamp;
              return bTime - aTime;
            });

          return validPosts.slice(0, 10);
        })
        .catch(() => {
          return [];
        });
    },

    getRecentPosts() {
      const postsCollection = collection(firestore, "posts");
      const recentPosts = query(
        postsCollection,
        orderBy("timestamp", "desc"),
        limit(10)
      );

      return getDocs(recentPosts)
        .then((grabPost) => {
          const posts = [];
          grabPost.docs.forEach((document) => {
            posts.push({
              id: document.id,
              ...document.data(),
            });
          });
          return posts;
        })
        .catch((error) => {
          return [];
        });
    },

    getUserPosts() {
      if (!this.userId) {
        return Promise.resolve([]);
      }

      const userRef = doc(firestore, "users", this.userId);

      return getDoc(userRef)
        .then((userDoc) => {
          if (!userDoc.exists()) {
            return [];
          }

          const userData = userDoc.data();
          const userPostIds = userData.posts || [];

          if (userPostIds.length === 0) {
            return [];
          }

          const userPosts = userPostIds.map(postId => {
            const postRef = doc(firestore, "posts", postId);
            return getDoc(postRef)
              .then((postDoc) => {
                if (postDoc.exists()) {
                  return {
                    id: postDoc.id,
                    ...postDoc.data(),
                  };
                }
                return null;
              })
              .catch(() => null);
          });

          return Promise.all(userPosts)
            .then((posts) => {
              return posts.filter(post => post !== null);
            });
        })
        .catch(() => {
          return [];
        });
    },

    addAuthor(posts) {
      if (posts.length === 0) {
        this.displayPosts = [];
        return;
      }

      const authoredPosts = [];
      let completedCount = 0;

      posts.forEach((post, index) => {
        this.userStore.getUserById(post.author)
          .then((author) => {
            authoredPosts[index] = {
              ...post,
              authorEmail: author ? author.email : 'Unknown User',
              authorId: post.author
            };
            completedCount++;

            if (completedCount === posts.length) {
              this.displayPosts = authoredPosts
                .filter(post => post !== undefined)
                .sort((a, b) => {
                  if (a.timestamp && b.timestamp) {
                    return b.timestamp.seconds - a.timestamp.seconds;
                  }
                  return 0;
                });
            }
          })
          .catch(() => {
            authoredPosts[index] = {
              ...post,
              authorEmail: 'Unknown User',
              authorId: post.author
            };
            completedCount++;

            if (completedCount === posts.length) {
              this.displayPosts = authoredPosts
                .filter(post => post !== undefined)
                .sort((a, b) => {
                  if (a.timestamp && b.timestamp) {
                    return b.timestamp.seconds - a.timestamp.seconds;
                  }
                  return 0;
                });
            }
          });
      });
    },

    formatDate(timestamp) {
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString().slice(0, 10);
      }
      return new Date(timestamp).toISOString().slice(0, 10);
    },

    formatTime(timestamp) {
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleTimeString('en-US');
      }
      return new Date(timestamp).toLocaleTimeString('en-US');
    }
  }
}
</script>

<style>
.postBox {
  display: flex;
  flex-direction: column;
  width: 750px;
  max-width: 100%;
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 5px 15px var(--shadow-light);
  margin-top: 50px;
}

.post_header {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-header);
}
</style>