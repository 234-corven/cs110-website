<template>
  <div class="post">
    <div class="post_info">
      @{{ username }} on {{ date }} at {{ time }}
    </div>
    <p class="post_content">{{ content }}</p>
  </div>
</template>

<script>
export default {
  name: 'Post',
  props: {
    username: {
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
  color: #000000;
  margin-bottom: 5px;
  font-weight: bold;
}

.post_content {
  font-size: 12px;
  color: #333333;
}
</style>