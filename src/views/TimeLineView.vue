<template>
  <header>
    <Navigation />
  </header>
  <div class="timeline-page">
    <div class="timeline-center">
      <template v-if="timelineUser">
        <TimeLine :user="timelineUser">
          <Feed :userId="timelineUser.id" :userEmail="timelineUser.email" />
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
  min-height: 75vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 1;
  padding: 30px 0;
  background: var(--bg-white);
}

.timeline-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 50px;
  width: 100%;
}
</style>