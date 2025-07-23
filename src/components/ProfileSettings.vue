<template>
    <div class="profile-settings">
      <h2>Profile Settings</h2>
      <form @submit.prevent="saveSettings">
        <div class="setting-row">
          <label for="private-toggle" class="setting-label">
            <span class="switch-label">Make my account private</span>
            <label class="switch">
              <input
                type="checkbox"
                id="private-toggle"
                v-model="isPrivate"
              />
              <span class="slider"></span>
            </label>
          </label>
          <span class="setting-desc">
            When your account is private, only your followers can see your posts and profile.
          </span>
        </div>
        <button type="submit" class="save-btn">Save Settings</button>
        <span v-if="saveSuccess" class="save-success">Settings saved!</span>
        <span v-if="saveError" class="save-error">Failed to save settings.</span>
      </form>
    </div>
  </template>

<script>
import { useUserStore } from '../stores/user'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { firestore } from '../firebaseResources.js'

export default {
  name: 'ProfileSettings',
  data() {
    return {
      isPrivate: false,
      saveSuccess: false,
      saveError: false
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  mounted() {
    if (this.userStore.user && typeof this.userStore.user.isPrivate === 'boolean') {
      this.isPrivate = this.userStore.user.isPrivate;
    }
  },
  methods: {
    async refreshPrivacyStatus() {
      if (!this.userStore.user) return;
      try {
        const userRef = doc(firestore, "users", this.userStore.user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.isPrivate = !!userData.isPrivate;
        }
      } catch (error) {
      }
    },
    async togglePrivacy() {
      if (!this.userStore.user) return;
      try {
        const userRef = doc(firestore, "users", this.userStore.user.id);
        await updateDoc(userRef, { isPrivate: this.isPrivate });
        this.userStore.user.isPrivate = this.isPrivate;
        this.saveSuccess = true;
        this.saveError = false;
      } catch (error) {
        this.saveSuccess = false;
        this.saveError = true;
      }
    },
    async saveSettings() {
      this.saveSuccess = false;
      this.saveError = false;
      if (!this.userStore.user) return;
      try {
        const userRef = doc(firestore, "users", this.userStore.user.id);
        await updateDoc(userRef, { isPrivate: this.isPrivate });
        this.userStore.user.isPrivate = this.isPrivate;
        this.saveSuccess = true;
      } catch (error) {
        this.saveError = true;
      }
    }
  }
}
</script>

<style scoped>
.profile-settings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
  padding: 24px;
  width: 350px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-settings h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 24px;
  color: var(--text-header);
}

.setting-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.setting-label {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  cursor: pointer;
  margin-bottom: 4px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  margin-right: 12px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: .4s;
}

.switch input:checked + .slider {
  background-color: #ffb6b6;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.switch input:checked + .slider:before {
  transform: translateX(20px);
}

.setting-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-left: 2px;
}

.save-btn {
  padding: 8px 16px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: var(--btn-post-hover);
}

.save-success {
  color: green;
  margin-left: 10px;
  font-size: 13px;
}

.save-error {
  color: red;
  margin-left: 10px;
  font-size: 13px;
}
</style>
