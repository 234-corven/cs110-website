<template>
  <RouterLink :to="timelineLink" class="timeline-button">
    Go to Timeline
  </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'TimelineButton',
  components: { RouterLink },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  computed: {
    timelineLink() {
      return `/profile/${this.userId}/timeline`;
    }
  }
}
</script>

<style scoped>
.timeline-button {
  margin-top: 14px;
  display: inline-block;
  padding: 10px 22px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border-radius: 6px;
  font-weight: bold;
  font-size: 17px;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;
}
.timeline-button:hover {
  background-color: var(--btn-post-hover);
  color: var(--text-white);
}
</style>
