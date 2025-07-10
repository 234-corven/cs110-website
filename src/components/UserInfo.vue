<template>
    <div class="userInfo">
    <h1 class="userEmail">
      {{ userToShow.email }}
    </h1>
    <div class="profileValues">
        <div class="userValue">
            <div>Posts</div>
            <div class="userValueDisplay">{{ userToShow.posts }}</div>
    </div>
    <div class="userValue">
            <div>Following</div>
        <div class="userValueDisplay">{{ userToShow.following }}</div>
    </div>
    <div class="userValue">
            <div>Followers</div>
        <div class="userValueDisplay">{{ userToShow.followers }}</div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
const userStore = useUserStore()

// Show viewingUser if set, otherwise show logged-in user
const userToShow = computed(() => userStore.viewingUser || userStore.user || {})
</script>


<style>
.profileValues {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.userEmail {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
}

.userValue {
    text-align: center;
    font-weight: bold;
}

.userInfo {
    position: fixed;
    top: 45%;
    left: 30%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 20px;
    background-color: rgb(236, 233, 28);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

</style>