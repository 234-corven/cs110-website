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
  position: absolute;
  top: 18px;
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
  gap: 5px;
  margin-top: 50px;
  margin-right: 15px;
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
  gap: 5px;
  margin-top: 50px;
  margin-left: 15px;
}

.frontLoginBox {
  display:flex;
  flex-direction: column;
  align-self: center;
  width: 150px;
  padding: 15px;
  background-color:var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
  text-align: center;
}

.frontLoginBox a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
}

.frontLoginBox a:hover {
  color: var(--link-hover);
  text-decoration: none;
}

</style>
