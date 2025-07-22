<script>
import { RouterLink, RouterView } from 'vue-router';
import Navigation from '../components/Navigation.vue';
import Login from '../components/Login.vue';
import WhoToFollow from '../components/whoToFollow.vue';
import Following from '../components/Following.vue';
import Feed from '../components/Feed.vue';
import PostButton from '../components/PostButton.vue';
import UserInfo from '../components/UserInfo.vue';
import { useUserStore } from '../stores/user';

export default {
  components: {
    RouterLink,
    RouterView,
    Navigation,
    Login,
    WhoToFollow,
    Following,
    Feed,
    PostButton,
    UserInfo
  },
  computed: {
    userStore() {
      return useUserStore();
    }
  }
}
</script>

<template>
  <div class="page_flex_box">
      <div class="left_section">
      <template v-if="!userStore.isLoggedIn">
        <div class="frontLoginBox">
          <RouterLink to="/login">Log In</RouterLink>
        </div>
      </template>
      <template v-else>
        <UserInfo />
        <PostButton />
      </template>
    </div>

    <div class="center_section">
      <Feed />
    </div>

    <div class="right_section">
      <whoToFollow />
      <template v-if="userStore.isLoggedIn">
        <Following />
      </template>
    </div>
  </div>

  <RouterView />

</template>

<style>
.page_flex_box {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
}

.left_section {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
}

.center_section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 800px;
}

.right_section {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
}

.frontLoginBox {
  width: 200px;
  padding: 20px;
  background-color:#E1D05C;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
