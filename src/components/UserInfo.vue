<template>
    <div class="userInfo">
        <h1 class="userEmail">
            {{ userToShow.email }}
        </h1>
        <div class="profileValues">
            <div class="userValue">
                <div>Posts</div>
                <div class="userValueDisplay">{{ userToShow.posts ? userToShow.posts.length : 0 }}</div>
            </div>
            <div class="userValue">
                <div>Following</div>
                <div class="userValueDisplay">{{ userToShow.following ? userToShow.following.length : 0 }}</div>
            </div>
            <div class="userValue">
                <div>Followers</div>
                <div class="userValueDisplay">{{ userToShow.followers ? userToShow.followers.length : 0 }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    computed: {
        userStore() {
            return useUserStore()
        },
        userToShow() {
            return this.user || this.userStore.user || {}
        }
    }
}
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
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    background-color: rgb(236, 233, 28);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>