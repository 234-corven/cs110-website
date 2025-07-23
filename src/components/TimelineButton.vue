<template>
  <RouterLink to="/timeline" class="timeline-btn">
    Go to Timeline
  </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'TimelineButton',
  components: { RouterLink }
}
</script>

<style scoped>
.timeline-btn {
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
.timeline-btn:hover {
  background-color: var(--btn-post-hover);
  color: var(--text-white);
}
</style>
