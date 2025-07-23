<template>
  <div class="notifications">
    <h2>Notifications</h2>
    <ul v-if="allNotifications.length > 0" class="notifications-list">
      <li v-for="(note, idx) in allNotifications" :key="idx">
        <div class="notif-row">
          <div class="notif-content notif-inline">
            <template v-if="note.followerId && note.followerEmail">
              <RouterLink :to="`/profile/${note.followerId}`" class="notif-link">
                {{ note.followerEmail }}
              </RouterLink>
              <span>followed you.</span>
            </template>
            <template v-else-if="note.authorId && note.authorEmail">
              <RouterLink :to="`/profile/${note.authorId}`" class="notif-link">
                {{ note.authorEmail }}
              </RouterLink>
              <span>made a new post.</span>
            </template>
            <template v-else>
              {{ note.message }}
            </template>
          </div>
          <button class="close-btn" @click="removeNotification(note, idx)">✖</button>
        </div>
        <div class="notification-time">{{ formatTime(note.timestamp) }}</div>
      </li>
    </ul>
    <div v-else class="no-notifications">
      No notifications yet.
    </div>
  </div>
</template>

<script>
import { firestore } from '../firebaseResources.js'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, getDoc, addDoc } from 'firebase/firestore'
import { RouterLink } from 'vue-router'

export default {
  name: "Notifications",
  components: { RouterLink },
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      notifications: [],
      unsubscribe: null,
      anniversaryNotifications: []
    }
  },
  computed: {
    allNotifications() {
      return [...this.notifications, ...this.anniversaryNotifications];
    }
  },
  watch: {
    userId: {
      async handler(newId) {
        await this.setupListener(newId);
        await this.checkAnniversaries(newId);
      },
      immediate: true
    }
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async removeNotification(note, idx) {
      if (note.id) {
        try {
          await deleteDoc(doc(firestore, "notifications", note.id));
        } catch (e) {
          this.notifications.splice(idx, 1);
        }
      } else {
        this.notifications.splice(idx, 1);
      }
    },
    async setupListener(userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      if (!userId) {
        this.notifications = [];
        return;
      }
      const notificationsRef = collection(firestore, "notifications");
      const q = query(
        notificationsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const notes = [];
      const snapshot = await new Promise(resolve => {
        this.unsubscribe = onSnapshot(q, resolve);
      });
      for (const docSnap of snapshot.docs) {
        const note = { id: docSnap.id, ...docSnap.data() };
        if (note.followerId && !note.followerEmail) {
          const userDoc = await getDoc(doc(firestore, "users", note.followerId));
          note.followerEmail = userDoc.exists() ? userDoc.data().email : "Unknown";
        }
        notes.push(note);
      }
      this.notifications = notes;
    },
    async checkAnniversaries(userId) {
      if (!userId) {
        this.anniversaryNotifications = [];
        return;
      }
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (!userDoc.exists()) {
        this.anniversaryNotifications = [];
        return;
      }
      const posts = userDoc.data().posts || [];
      const today = new Date();
      const anniversaryNotes = [];
      const notificationsRef = collection(firestore, "notifications");
      for (const postId of posts) {
        const postDoc = await getDoc(doc(firestore, "posts", postId));
        if (postDoc.exists()) {
          const post = postDoc.data();
          let anniversaryDate = null;
          if (post.userDate) {
            anniversaryDate = new Date(post.userDate);
          } else if (post.timestamp) {
            if (post.timestamp.seconds) {
              anniversaryDate = new Date(post.timestamp.seconds * 1000);
            } else {
              anniversaryDate = new Date(post.timestamp);
            }
          }
          if (anniversaryDate &&
            anniversaryDate.getDate() === today.getDate() &&
            anniversaryDate.getMonth() === today.getMonth() &&
            anniversaryDate.getFullYear() !== today.getFullYear()
          ) {
            const message = `🎉 It's the anniversary of your post "${post.title || 'Untitled'}"!`;
            const alreadyExists = this.notifications.some(n =>
              n.message === message &&
              new Date(n.timestamp).toDateString() === today.toDateString()
            );
            if (!alreadyExists) {
              await addDoc(notificationsRef, {
                userId,
                postId,
                message,
                timestamp: today.getTime()
              });
            }
            anniversaryNotes.push({
              message,
              timestamp: today.getTime()
            });
          }
        }
      }
      this.anniversaryNotifications = anniversaryNotes;
    },
    formatTime(ts) {
      return new Date(ts).toLocaleString();
    }
  }
}
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
  margin-top: 10px;
}

.notifications h2 {
  margin-top: 0;
  margin-bottom: 3px;
  font-size: 22px;
  padding-bottom: 4px;
  color: var(--text-header);
  border-bottom: 2px solid var(--text-header);
}

.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications-list li {
  padding: 3px 0;
  border-bottom: 1px solid var(--border-primary);
  font-size: 15px;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.notifications-list li:last-child {
  border-bottom: none;
}

.notif-row {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  flex-wrap: wrap;
  word-break: break-word;
  white-space: normal;
  min-width: 0; 
}

.notification-time {
  margin-left: 0;
  margin-top: 0px;
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;
  margin-top: 0px;
  transition: color 0.2s;
  padding: 0 4px;
  align-self: center;
}

.close-btn:hover {
  color: #d32f2f;
}

.no-notifications {
  color: var(--text-secondary);
  font-style: italic;
  text-align: left;
  padding: 8px 0;
}

.notif-link {
  color: var(--link-color);
  font-weight: bold;
  text-decoration: none;
  margin-right: 2px;
}

.notif-link:hover {
  color: var(--link-hover);
  text-decoration: underline;
}
</style>
