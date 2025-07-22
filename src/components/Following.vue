<template>
    <div class="following">
        <h2>Following</h2>
        <ul v-if="followingUsers.length > 0" class="following_list">
            <li v-for="user in followingUsers" :key="user.id">
                <RouterLink :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
                <button class="unfollow_button" @click="unfollowUser(user.id)">
                    Unfollow
                </button>
            </li>
        </ul>
        <div v-else class="no-following">
            Not following anyone yet
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores/user';
import { firestore } from '../firebaseResources.js';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

export default {
    components: {
        RouterLink
    },
    data() {
        return {
            followingUsers: []
        }
    },
    computed: {
        userStore() {
            return useUserStore();
        }
    },
    mounted() {
        this.loadFollowingUsers();
    },
    watch: {
        'userStore.user.following': {
            handler() {
                this.loadFollowingUsers();
            },
            deep: true
        }
    },
    methods: {
        loadFollowingUsers() {
            if (!this.userStore.user || !this.userStore.user.following) {
                this.followingUsers = [];
                return;
            }

            const followingIds = this.userStore.user.following;
            if (followingIds.length === 0) {
                this.followingUsers = [];
                return;
            }

            const userFollowing = followingIds.map(userId => {
                return this.userStore.getUserById(userId)
                    .then((user) => {
                        return user;
                    })
                    .catch(() => null);
            });

            Promise.all(userFollowing)
                .then((users) => {
                    this.followingUsers = users.filter(user => user !== null);
                })
                .catch(() => {
                    this.followingUsers = [];
                });
        },

        async unfollowUser(targetUserId) {
            try {
                await this.userStore.unfollowUser(targetUserId);
            } catch (error) {
                console.error('Error unfollowing user:', error);
            }
        }
    }
}
</script>

<style>
.following {
    display: flex;
    flex-direction: column;
    width: 275px;
    padding: 10px 20px;
    background-color: var(--bg-primary);
    border-radius: 8px;
    box-shadow: 0 2px 10px var(--shadow-light);
    margin-top: 0px;
}

.following h2 {
    margin-top: 0;
    margin-bottom: 3px;
    font-size: 25px;
    padding-bottom: 4px;
    color: var(--text-header);
    border-bottom: 2px solid var(--text-header);
}

.following_list {
    line-height: 2;
    list-style: none;
    padding: 0;
    margin: 0;
}

.following_list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
    margin-bottom: 4px;
}

.following_list a {
    color: var(--link-color);
    text-decoration: none;
}

.following_list a:hover {
    color: var(--link-hover);
    text-decoration: none;
}

.unfollow_button {
    padding: 3px 8px;
    background-color: var(--btn-unfollow);
    color: var(--bg-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.unfollow_button:hover {
    background-color: var(--btn-unfollow-hover);
}

.no-following {
    color: var(--text-secondary);
    font-style: italic;
    text-align: center;
    padding: 10px 0;
}
</style>
