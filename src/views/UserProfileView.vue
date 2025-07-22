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
        <PostButton v-if="!userID || (userStore.user && userID === userStore.user.id)" />
      </template>
    </div>

    <div class="center_section">
      <Feed :userId="userPage?.id" :userEmail="userPage?.email" />

    </div>

    <div class="right_section">
      <whoToFollow v-if="userID && userStore.user && userID !== userStore.user.id" />
      <template v-if="userStore.isLoggedIn">
        <Following />
      </template>
    </div>

    <RouterView />
  </div>

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Following from '../components/Following.vue';
import Feed from '../components/Feed.vue';
import UserInfo from '../components/UserInfo.vue';
import PostButton from '../components/PostButton.vue';
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
    PostButton
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
    }
  }
};
</script>

<style>
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