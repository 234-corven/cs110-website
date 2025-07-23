<template>
  <div class="postBox">
    <div class="feed_header">
      <span>{{ headerText }}</span>
      <button 
        v-if="isViewingOtherUser" 
        @click="toggleFollow"
        class="follow-button"
        :class="{ 'following': isFollowing }"
      >
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </button>
    </div>
    <template v-if="!userId || !isUserPrivate || canViewPrivatePosts">
      <Post v-for="current_post in displayPosts" :key="current_post.id" 
        :id="current_post.id"
        :username="current_post.authorEmail"
        :userId="current_post.authorId" 
        :title="current_post.title"
        :date="formatDate(current_post.timestamp)" 
        :time="formatTime(current_post.timestamp)"
        :userDate="current_post.userDate"
        :isImportant="current_post.isImportant"
        :content="current_post.content"
        :editedAt="current_post.editedAt"
        @post-edited="loadPosts"
      />
      <div v-if="displayPosts.length === 0">
        <template v-if="userId && isUserPrivate">
          <div class="private-feed-message">
            This user's posts are private and only visible to followers.
          </div>
          </template>
        <template v-else>
          {{ userId ? 'This user hasn\'t posted anything yet.' : 'No posts available.' }}
        </template>
      </div>
    </template>
    <template v-else>
      <div class="private-feed-message">
        This user's posts are private and only visible to followers.
      </div>
    </template>
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
      displayPosts: [],
      isUserPrivate: false,
      canViewPrivatePosts: false
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
        return `${this.userEmail}'s posts`;
      }
      return 'Recent Posts';
    },
    isViewingOtherUser() {
      return this.userId && this.userStore.user && this.userId !== this.userStore.user.id;
    },
    isFollowing() {
      if (!this.userStore.user || !this.userId) return false;
      return this.userStore.user.following && this.userStore.user.following.includes(this.userId);
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
      // If not logged in, always show recent public posts
      if (!this.isLoggedIn) {
        return this.getRecentPosts();
      }
      // If logged in and not viewing a specific user, show feed
      return this.getFeedPosts();
    },

    async getRecentPosts() {
      const postsCollection = collection(firestore, "posts");
      const recentPosts = query(
        postsCollection,
        orderBy("timestamp", "desc"),
        limit(30)
      );

      const grabPost = await getDocs(recentPosts);
      const posts = [];
      const authorIds = [];
      for (const document of grabPost.docs) {
        const postData = document.data();
        if (postData.author) {
          authorIds.push(postData.author);
          posts.push({
            id: document.id,
            ...postData,
          });
        }
      }

      const authorPromises = authorIds.map(authorId => {
        const authorRef = doc(firestore, "users", authorId);
        return getDoc(authorRef).then(docSnap => docSnap.exists() ? docSnap.data() : null);
      });
      const authors = await Promise.all(authorPromises);

      // Filter posts by privacy
      const filteredPosts = posts.filter((post, idx) => {
        const authorData = authors[idx];
        if (!authorData) return false;
        const isPrivate = !!authorData.isPrivate;
        const isOwner = this.userStore.user && authorIds[idx] === this.userStore.user.id;
        const isFollower = this.userStore.user && authorData.followers && authorData.followers.includes(this.userStore.user.id);
        return !isPrivate || isOwner || isFollower;
      });

      return filteredPosts.slice(0, 10);
    },

    async getFeedPosts() {
      if (!this.userStore.user || !this.userStore.user.feed) {
        return this.getEmptyArray();
      }

      const feedPostIds = this.userStore.user.feed || [];
      if (feedPostIds.length === 0) {
        return this.getEmptyArray();
      }

      const postToShow = feedPostIds.map(async postId => {
        const postRef = doc(firestore, "posts", postId);
        const postDoc = await getDoc(postRef);
        if (!postDoc.exists()) return null;
        const postData = postDoc.data();
        if (!postData.author) return null;
        const authorRef = doc(firestore, "users", postData.author);
        const authorDoc = await getDoc(authorRef);
        let authorData = {};
        if (authorDoc.exists()) {
          authorData = authorDoc.data();
        }
        const isPrivate = !!authorData.isPrivate;
        const isOwner = this.userStore.user && authorDoc.exists() && authorDoc.id === this.userStore.user.id;
        const isFollower = this.userStore.user && authorData.followers && authorData.followers.includes(this.userStore.user.id);

        if (!isPrivate || isOwner || isFollower) {
          return {
            id: postDoc.id,
            ...postData,
          };
        }
        return null;
      });

      const posts = await Promise.all(postToShow);
      return posts.filter(post => post !== null && post.timestamp).sort((a, b) => {
        const aTime = a.timestamp.seconds || a.timestamp;
        const bTime = b.timestamp.seconds || b.timestamp;
        return bTime - aTime;
      }).slice(0, 10);
    },

    async getUserPosts() {
      if (!this.userId) {
        return Promise.resolve([]);
      }

      const userRef = doc(firestore, "users", this.userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        this.isUserPrivate = false;
        this.canViewPrivatePosts = false;
        return [];
      }
      const userData = userDoc.data();

      // Check privacy
      const isPrivate = !!userData.isPrivate;
      this.isUserPrivate = isPrivate;
      const isOwner = this.userStore.user && this.userStore.user.id === this.userId;
      const isFollower = this.userStore.user && userData.followers && userData.followers.includes(this.userStore.user.id);
      this.canViewPrivatePosts = isOwner || isFollower;

      if (isPrivate && !isOwner && !isFollower) {
        // Not allowed to see posts
        return [];
      }

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
        .then((posts) => posts.filter(post => post !== null));
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
    },

    async toggleFollow() {
      if (!this.userStore.user || !this.userId) return;
      
      try {
        if (this.isFollowing) {
          await this.userStore.unfollowUser(this.userId);
        } else {
          await this.userStore.followUser(this.userId);
        }
        
        // notifies UserProfileView to update the follow status
        this.$emit('user-follow-changed', this.userId);
        window.dispatchEvent(new CustomEvent('userFollowChanged', { 
          detail: { userId: this.userId } 
        }));
      } catch (error) {
        console.error('Error toggling follow status:', error);
      }
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
  padding: 8px 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 5px 15px var(--shadow-light);
  margin-top: 50px;
}

.feed_header {
  font-size: 30px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--text-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.postBox .post {
  background-color: var(--bg-white);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px var(--shadow-light);
  transition: box-shadow 0.3s ease;
}

.postBox .post:hover {
  box-shadow: 0 4px 10px var(--shadow-medium);
}

.postBox .post:last-child {
  margin-bottom: 0; 
}

.follow-button {
  margin-left: 10px;
  padding: 6px 12px;
  background-color: var(--btn-follow);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;

  font-size: 16px;
}

.follow-button:hover {
  background-color: var(--btn-follow-hover);
}

/*Unfollow button*/
.follow-button.following {
  padding: 6x 12px;
  background-color: var(--btn-unfollow);
  color: var(--bg-white);
  min-width: auto;
  width: auto;

  font-size: 16px;
}

.follow-button.following:hover {
  background-color: var(--btn-unfollow-hover);
}

.private-feed-message {
  color: var(--text-primary);
  font-style: italic;
  text-align: left;
  font-size: 16px;
}
</style>