<template>
  <div class="postBox">
    <div class="post_header">{{ isLoggedIn ? 'Your Feed' : 'Recent Posts' }}</div>
    <Post v-for="current_post in displayPosts" :key="current_post.id"
      :username="current_post.authorEmail" 
      :date="formatDate(current_post.timestamp)" 
      :time="formatTime(current_post.timestamp)"
      :content="current_post.content" />
    <div v-if="displayPosts.length === 0" >
      {{ isLoggedIn ? 'No posts in your feed. Follow some users to see their posts!' : 'No posts available.' }}
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
    }
  },
  mounted() {
    this.loadPosts();
  },
  watch: {
    isLoggedIn() {
      this.loadPosts();
    }
  },
  methods: {
    loadPosts() {
      this.getDisplayPosts()
        .then((posts) => {
          this.addAuthor(posts);
        });
    },

    getDisplayPosts() {
      if (this.isLoggedIn) {
        return this.getFeedPosts();
      } else {
        return this.getRecentPosts();
      }
    },

    getFeedPosts() {
      const feedPostIds = this.userStore.user.feed.slice(-10).reverse();
      if (feedPostIds.length === 0) {
        const postsCollection = collection(firestore, "posts");
        const emptyFeed = query(postsCollection, limit(0));
        return getDocs(emptyFeed)
          .then(() => {
            return [];
          })
          .catch(() => {
            return [];
          });
      }

      const firstPostId = feedPostIds[0];
      const firstPostRef = doc(firestore, "posts", firstPostId);
      const allPosts = [];

      let grabPost = getDoc(firstPostRef)
        .then((postDoc) => {
          if (postDoc.exists()) {
            allPosts.push({
              id: postDoc.id,
              ...postDoc.data(),
            });
          }
          return allPosts;
        })
        .catch((error) => {
          return [];
        });

      for (let i = 1; i < feedPostIds.length; i++) {
        const postId = feedPostIds[i];
        const postRef = doc(firestore, "posts", postId);

        grabPost = grabPost
          .then(() => {
            return getDoc(postRef);
          })
          .then((postDoc) => {
            if (postDoc.exists()) {
              allPosts.push({
                id: postDoc.id,
                ...postDoc.data(),
              });
            }
            return allPosts;
          })
          .catch((error) => {
            return [];
          });
      }

      return grabPost.then(() => {
        return allPosts.filter((post) => post !== null);
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
    
    addAuthor(posts) {
      const authoredPosts = [];
      
      posts.forEach((post) => {
        this.userStore.getUserById(post.author)
          .then((author) => {
            const fullPost = {
              ...post,
              authorEmail: author.email
            };
            authoredPosts.push(fullPost);
            
            if (authoredPosts.length === posts.length) {
              this.displayPosts = authoredPosts.sort((a, b) => {
                if (a.timestamp && b.timestamp) {
                  return b.timestamp.seconds - a.timestamp.seconds;
                }
                return 0;
              });
            }
          });
      });
      
      if (posts.length === 0) {
        this.displayPosts = [];
      }
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
  position: fixed;
  top: 47.75%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  padding: 20px;
  background-color: rgb(236, 233, 28);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.post_header {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>