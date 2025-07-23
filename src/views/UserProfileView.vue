<script>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Following from '../components/Following.vue';
import Feed from '../components/Feed.vue';
import UserInfo from '../components/UserInfo.vue';
import PostButton from '../components/PostButton.vue';
import Notifications from '../components/Notifications.vue';
import { useUserStore } from '../stores/user';

export default {
  components: {
    RouterLink,
    RouterView,
    Navigation,
    WhoToFollow,
    Following,
    Feed,
    UserInfo,
    PostButton,
    Notifications
  },
  data() {
    return {
      profileUser: null,
      loading: true
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    userID() {
      return this.$route.params.id;
    },
    userPage() {
      return this.profileUser;
    }
  },
  mounted() {
    this.loadUserProfile();
  },
  watch: {
    '$route.params.id'() {
      this.loadUserProfile();
    }
  },
  methods: {
    loadUserProfile() {
      if (this.userID) {
        this.loading = true;
        this.userStore.getUserById(this.userID)
          .then((user) => {
            this.profileUser = user;
            this.loading = false;
          })
          .catch((error) => {
            this.profileUser = null;
            this.loading = false;
          });
      } else {
        this.profileUser = this.userStore.user;
        this.loading = false;
      }
    },

    handleFollowChange(userId) {
      // Reload the user profile to get updated follower count
      this.loadUserProfile();
    }
  }
};
</script>

<template>
  <header>
    <div class="navBar">
      <nav>
        <Navigation />
      </nav>
    </div>
  </header>

  <div class="page_flex_box">
    <div class="left_section">
      <template v-if="!userStore.isLoggedIn">
        <div class="frontLoginBox">
          <RouterLink to="/login">Log In</RouterLink>
        </div>
      </template>
      <template v-else-if="loading">
        <div class="loading">Loading user profile...</div>
      </template>
      <template v-else>
        <UserInfo :user="userPage" />
        <Notifications v-if="userPage && userPage.id" :userId="userPage.id" />
      </template>
    </div>
    <div class="center_section">
      <template v-if="userStore.isLoggedIn && (!userID || (userStore.user && userID === userStore.user.id))">
        <div class="profile-post-button">
          <PostButton />
        </div>
      </template>
      <Feed :userId="userPage?.id" :userEmail="userPage?.email" @user-follow-changed="handleFollowChange" />
    </div>
    <div class="right_section">
      <template v-if="!userStore.isLoggedIn && userID">
        <UserInfo :user="userPage" />
      </template>
      <whoToFollow v-if="userID && userStore.user && userID !== userStore.user.id" />
      <template v-if="userStore.isLoggedIn && (!userID || (userStore.user && userID === userStore.user.id))">
        <Following />
      </template>
    </div>
    <RouterView />
  </div>
</template>



<style scoped>
.page_flex_box {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto; 
}

.left_section {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 50px;
}

.right_section {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 50px;
}

.center_section {
  flex-direction: column;
  display: flex;
  align-items: flex-start; 
  margin-top: 50px;
}

.center_section .profile-post-button {
  margin-bottom: 0;
  width: 760px !important;
  margin-left: 3px !important;
  margin-bottom: 3px !important;
}

.center_section .profile-post-button .createPostBox {
  width: 100% !important;
}

.profile-post-button .post-input {
  width: 100% !important;
  min-height: 80px !important;
}

.profile-post-button .checkbox-input {
  width: 100% !important;
}

.center_section .postBox{
  margin-top: 0px !important;
}


.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
  font-size: 18px;
  font-weight: bold;
}
</style>