<template>
  <div class="notifications">
    <h2>Notifications</h2>
    <ul v-if="notifications.length > 0" class="notifications-list">
      <li v-for="(note, idx) in notifications" :key="idx">
        <div class="notif-content">
          <template v-if="note.followerId && note.followerEmail">
            <router-link :to="`/profile/${note.followerId}`" class="notif-link">
              {{ note.followerEmail }}
            </router-link>
            <span> followed you.</span>
          </template>
          <template v-else>
            {{ note.message }}
          </template>
          <span class="notification-time">{{ formatTime(note.timestamp) }}</span>
        </div>
        <button class="close-btn" @click="removeNotification(note, idx)">✖</button>
      </li>
    </ul>
    <div v-else class="no-notifications">
      No notifications yet.
    </div>
  </div>
</template>

<script>
import { firestore } from '../firebaseResources.js'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
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
      unsubscribe: null
    }
  },
  watch: {
    userId: {
      handler(newId) {
        this.setupListener(newId);
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
    setupListener(userId) {
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
      this.unsubscribe = onSnapshot(q, (snapshot) => {
        this.notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
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
  padding: 6px 0;
  border-bottom: 1px solid var(--border-primary);
  font-size: 15px;
  color: var(--text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.notifications-list li:last-child {
  border-bottom: none;
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.notification-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 12px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;
  transition: color 0.2s;
  padding: 0 4px;
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
