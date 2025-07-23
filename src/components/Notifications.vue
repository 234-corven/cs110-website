<template>
  <div class="notifications">
    <h2>Notifications</h2>
    <ul v-if="notifications.length > 0" class="notifications-list">
      <li v-for="(note, idx) in notifications" :key="idx">
        {{ note.message }}
        <span class="notification-time">{{ formatTime(note.timestamp) }}</span>
      </li>
    </ul>
    <div v-else class="no-notifications">
      No notifications yet.
    </div>
  </div>
</template>

<script>
import { firestore } from '../firebaseResources.js'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export default {
  name: "Notifications",
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
        this.notifications = snapshot.docs.map(doc => doc.data());
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
}

.notifications-list li:last-child {
  border-bottom: none;
}

.notification-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 12px;
}

.no-notifications {
  color: var(--text-secondary);
  font-style: italic;
  text-align: left;
  padding: 8px 0;
}
</style>
