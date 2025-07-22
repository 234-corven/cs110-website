<template>
  <div class="post">
    <div class="post_info">
      @<RouterLink :to="`/profile/${userId}`" class="username-link">{{ username }}</RouterLink> on {{ date }} at {{ time }}
    </div>
    <p class="post_content">{{ content }}</p>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: 'Post',
  components: {
    RouterLink
  },
  props: {
    username: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.post {
 background-color: var(--post-bg);
  border: 1px solid var(--post-border);
  border-radius: var(--post-radius);
  padding: var(--post-padding);
  margin-bottom: var(--post-margin);
  box-shadow: var(--post-shadow);
  transition: box-shadow 0.3s ease
}

.post:hover {
  box-shadow: var(--post-shadow-hover);
}

.post_info {
  font-size: 14px;
  color: var(--text-header);
  margin-bottom: 10px;
  font-weight: bold;
}

.username-link {
  color: var(--link-color);
  text-decoration: none;
}

.username-link:hover {
  text-decoration: underline;
}

.post_content {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}
</style>