<template>
  <div class="post">
    <h3 class="post_title" v-if="title">{{ title }}</h3>
    <div class="post_info">
      @<RouterLink :to="`/profile/${userId}`" class="username-link">{{ username }}</RouterLink> 
      <span v-if="userDate" class="user-date">on {{ formatUserDate(userDate) }}</span>
      <span class="submission-info">• Posted {{ date }} at {{ time }}</span>
    </div>
    <div class="post_content" v-html="content"></div>
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
    },
    title: {
      type: String,
      default: ''
    },
    userDate: {
      type: String,
      default: null
    }
  },
  methods: {
    formatUserDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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

.user-date {
  color: var(--text-primary);
  font-weight: normal;
}

.submission-info {
  color: var(--text-secondary);
  font-weight: normal;
  font-size: 12px;
}

.username-link {
  color: var(--link-color);
  text-decoration: none;
}

.username-link:hover {
  text-decoration: none;
}

.post_title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-header);
  margin: 8px 0 12px 0;
  line-height: 1.3;
}

.post_content {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

/* Style rich text content */
.post_content b, .post_content strong {
  font-weight: bold;
}

.post_content i, .post_content em {
  font-style: italic;
}

.post_content u {
  text-decoration: underline;
}

.post_content s {
  text-decoration: line-through;
}

.post_content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.post_content ol {
  margin: 8px 0;
  padding-left: 20px;
}

.post_content a {
  color: var(--link-color);
  text-decoration: underline;
}

.post_content a:hover {
  color: var(--link-hover);
}

.post_content [style*="text-align: center"] {
  text-align: center;
}

.post_content [style*="text-align: right"] {
  text-align: right;
}

.post_content [style*="text-align: left"] {
  text-align: left;
}
</style>