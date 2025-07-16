<template>
  <header>
    <div class="navBar">
      <nav>
        <Navigation />
      </nav>
    </div>
  </header>

  <template v-if="!userStore.isLoggedIn">
    <div class="frontLoginBox">
      <RouterLink to="/login">Log In</RouterLink>
    </div>
  </template>
  <template v-else>
    <UserInfo :user="userPage" />
    <PostButton />
  </template>

  <Feed />

  <whoToFollow />

  <RouterView />

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import WhoToFollow from '../components/whoToFollow.vue';
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
    Feed,
    UserInfo,
    PostButton
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    userID() {
      return this.$route.params.id;
    },
    userPage() {
      if (this.userID) {
        return this.userStore.userList.find(u => u.id == this.userID);
      }
      return null;
    }
  }
};
</script>

<style></style>