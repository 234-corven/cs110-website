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
.post_info {
  font-size: 14px;
  color: var(--text-header);
  margin-bottom: 5px;
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
  font-size: 12px;
  color: var(--text-primary);
}
</style>