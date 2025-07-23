<template>
  <header>
    <Navigation />
  </header>
  <div class="timeline-page">
    <div class="timeline-left">
      <UserInfo :user="timelineUser" />
      <TimelineButton v-if="timelineUser && timelineUser.id" :userId="timelineUser.id" />
    </div>
    <div class="timeline-center">
      <template v-if="timelineUser">
        <TimeLine :user="timelineUser">
          <Feed
            :userId="timelineUser.id"
            :userEmail="timelineUser.email"
          />
        </TimeLine>
      </template>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import UserInfo from '../components/UserInfo.vue'
import TimelineButton from '../components/TimelineButton.vue'
import Feed from '../components/Feed.vue'
import TimeLine from '../components/TimeLine.vue'
import { useUserStore } from '../stores/user'

export default {
  name: 'TimeLineView',
  components: {
    Navigation,
    UserInfo,
    TimelineButton,
    Feed,
    TimeLine
  },
  data() {
    return {
      timelineUser: null
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    routeUserId() {
      return this.$route.params.id;
    }
  },
  watch: {
    routeUserId: {
      handler() {
        this.loadTimelineUser();
      },
      immediate: true
    },
    'userStore.user': {
      handler() {
        this.loadTimelineUser();
      }
    }
  },
  methods: {
    async loadTimelineUser() {
      if (this.routeUserId) {
        const user = await this.userStore.getUserById(this.routeUserId);
        this.timelineUser = user;
      } else {
        this.timelineUser = this.userStore.user;
      }
    }
  }
}
</script>

<style scoped>
.timeline-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 30px 0;
  background: var(--bg-white);
}
.timeline-left {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 50px;
}
.timeline-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 50px;
}
</style>
