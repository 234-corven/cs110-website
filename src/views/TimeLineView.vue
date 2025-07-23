<template>
  <header>
    <Navigation />
  </header>
  <div class="timeline-container">
    <Feed />
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import Feed from '../components/Feed.vue'

export default {
  name: 'TimeLineView',
  components: {
    Navigation,
    Feed
  }
}
</script>

<style scoped>
.timeline-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 0;
  min-height: 100vh;
  background: var(--bg-secondary);
}
</style>
