<template>
  <div class="userInfo">
    <h1 v-if="store.isViewingOther" class="userEmail">
        {{ userStore.viewingUser }}
    </h1>
    <h1 v-else class="userEmail">
        {{ userStore.currentUser }}
    </h1>
    <div class="profileInfo">
        <div class="userValue">
            <div>Posts</div>
            <div class="userNumber">{{ store.posts }}</div>
        </div>
            <div class="userValue">
            <div>Following</div>
        <div class="stat-userNumber">{{ store.following }}</div>
        </div>
            <div class="userValue">
            <div>Followers</div>
        <div class="userNumber">{{ store.followers }}</div>
        </div>
  </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user.js'
const userStore = useUserStore();
</script>

<style>

</style>