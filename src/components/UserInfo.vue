<template>
    <div class="userInfo">
        <h1 class="userEmail">
            <RouterLink :to="`/profile/${userToShow.id}`">{{ userToShow.email }}</RouterLink>
            <template v-if="canTogglePrivacy">
                <RouterLink to="/profile/self/settings" class="settings-link" title="Profile Settings">
                    <span class="settings-icon">⚙️</span>
                </RouterLink>
            </template>
        </h1>
        <div class="account-badge-row">
            <span 
              v-if="userToShow.isPrivate" 
              class="private-badge"
            >Private Account</span>
            <span 
              v-else 
              class="public-badge"
            >Public Account</span>
        </div>
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
import { RouterLink } from 'vue-router'

export default {
    components: { RouterLink },
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            localUser: null
        }
    },
    computed: {
        userStore() {
            return useUserStore()
        },
        userToShow() {
            return this.localUser || this.user || this.userStore.user || {}
        },
        canTogglePrivacy() {
            return this.userToShow.id === this.userStore.user?.id;
        }
    },
    watch: {
        user: {
            handler(newUser) {
                if (newUser) {
                    this.localUser = { ...newUser };
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        async refreshUserData() {
            if (this.user && this.user.id) {
                try {
                    const updatedUser = await this.userStore.getUserById(this.user.id);
                    if (updatedUser) {
                        this.localUser = updatedUser;
                    }
                } catch (error) {
                    console.error('Error refreshing user data:', error);
                }
            }
        }
    },
    mounted() {
        window.addEventListener('userFollowChanged', this.refreshUserData);
    },
    beforeUnmount() {
        window.removeEventListener('userFollowChanged', this.refreshUserData);
    }
}
</script>

<style>
.profileValues {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}

.userEmail {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0px;
    margin-top: 0;
    padding-bottom: 8px;
    color: var(--text-header); 
    border-bottom: 2px solid var(--text-header);
}

.userEmail a {
    color: var(--link-color);
    text-decoration: none;
    font-weight: bold;
}

.userEmail a:hover {
    color: var(--link-hover);
    text-decoration: none;
}

.userValue {
    text-align: center;
    font-weight: bold;
}

.userValueDisplay {
    font-size: 1em;
    color: var(--text-primary);
}

.userInfo {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px 20px;
    background-color: var(--bg-primary);
    border-radius: 8px;
    box-shadow: 0 2px 10px var(--shadow-light);
    margin-left: auto;
}

.account-badge-row {
    margin-top: 4px;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    min-height: 24px;
    gap: 12px;
}

.private-badge {
    padding: 2px 8px;
    background: #ffb6b6;
    color: #a70000;
    border-radius: 10px;
    font-size: 0.9em;
    font-weight: bold;
    vertical-align: middle;
}

.public-badge {
    padding: 2px 8px;
    background: #b6ffd1;
    color: #007a2b;
    border-radius: 10px;
    font-size: 0.9em;
    font-weight: bold;
    vertical-align: middle;
}

.settings-link {
    margin-left: 10px;
    vertical-align: middle;
    display: inline-block;
}

.settings-icon {
    font-size: 22px;
    color: #888;
    transition: color 0.2s;
}

.settings-link:hover .settings-icon {
    color: #007bff;
}
</style>