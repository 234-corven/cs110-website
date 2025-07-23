<template>
  <div class="timeline">
    <div class="timeline-header">
      <h1>
        <RouterLink v-if="user && user.id" :to="`/profile/${user.id}`">{{ user.email }}</RouterLink>
        <span v-if="user && user.email">'s Timeline</span>
      </h1>
    </div>
    <div class="timeline-content">
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'TimeLine',
  components: { RouterLink },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.timeline {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg-white);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow-light);
  padding: 24px 32px;
}

.timeline-header {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-header);
  margin-bottom: 24px;
  text-align: left;
}

.timeline-header a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  font-size: 32px;
  transition: color 0.2s;
}

.timeline-header a:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

.timeline-content {
  width: 100%;
}
</style>
