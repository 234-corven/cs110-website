<script>
import { useUserStore } from '../stores/user'
import { firestore } from '../firebaseResources.js'
import { collection, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore'

export default {
  data() {
    return {
      content: '',
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  methods: {
    updateContent() {
      this.content = this.$refs.editor.innerHTML;
    },

    formatText(command, value = null) {
      document.execCommand(command, false, value);
      this.$refs.editor.focus();
      this.updateContent();
    },

    insertLink() {
      const url = prompt('Enter URL:');
      if (url) {
        this.formatText('createLink', url);
      }
    },

    changeFontSize() {
      const size = prompt('Enter font size (1-7):');
      if (size && size >= 1 && size <= 7) {
        this.formatText('fontSize', size);
      }
    },

    changeTextColor() {
      const color = prompt('Enter color (e.g., red, #ff0000):');
      if (color) {
        this.formatText('foreColor', color);
      }
    },

    handlePost() {
      const plainText = this.$refs.editor.innerText.trim();
      if (plainText) {
        this.createPost(this.content);
        this.$refs.editor.innerHTML = '';
        this.content = '';
      } else {
        alert("Post cannot be empty.");
      }
    },

    createPost(content) {
      if (!this.userStore.user) {
        alert("You must be logged in to post.");
        return;
      }

      const postsCollection = collection(firestore, "posts");
      const newPost = {
        timestamp: serverTimestamp(),
        author: this.userStore.user.id,
        content: content.trim(),
      };

      addDoc(postsCollection, newPost)
        .then((postDocRef) => {
          const postId = postDocRef.id;

          const currentUserRef = doc(firestore, "users", this.userStore.user.id);
          updateDoc(currentUserRef, {
            posts: arrayUnion(postId),
            feed: arrayUnion(postId)  
          })
            .then(() => {
              this.userStore.user.posts = [...(this.userStore.user.posts || []), postId];
              this.userStore.user.feed = [...(this.userStore.user.feed || []), postId];  // Update local feed too

              this.addPostToFollowersFeeds(postId);

              // Emit event to refresh the feed
              window.dispatchEvent(new CustomEvent('postCreated'));

              alert("Post created successfully!");
            })
            .catch((error) => {
              alert("Failed to update user posts. Please try again.");
            });
        })
        .catch((error) => {
          alert("Failed to create post. Please try again.");
        });
    },

    addPostToFollowersFeeds(postId) {
      if (!this.userStore.user.followers || this.userStore.user.followers.length === 0) {
        return;
      }

      this.userStore.user.followers.forEach((followerId) => {
        const followerRef = doc(firestore, "users", followerId);
        updateDoc(followerRef, {
          feed: arrayUnion(postId),
        }).catch((error) => {});
      });
    }
  }
}
</script>

<template>
  <div class="createPostBox">
    <h1>Create a Post</h1>
    <form class="PostInput">
      <div class="editor-toolbar">
        <button type="button" @click="formatText('bold')" title="Bold">B</button>
        <button type="button" @click="formatText('italic')" title="Italic">I</button>
        <button type="button" @click="formatText('underline')" title="Underline">U</button>
        <button type="button" @click="formatText('strikeThrough')" title="Strikethrough">S</button>
        
        <span class="separator">|</span>
        
        <button type="button" @click="formatText('justifyLeft')" title="Align Left">⬅</button>
        <button type="button" @click="formatText('justifyCenter')" title="Center">↔</button>
        <button type="button" @click="formatText('justifyRight')" title="Align Right">➡</button>
        
        <span class="separator">|</span>
        
        <button type="button" @click="formatText('insertOrderedList')" title="Numbered List">#</button>
        <button type="button" @click="formatText('insertUnorderedList')" title="Bullet List">•</button>
        
        <span class="separator">|</span>
        
        <button type="button" @click="insertLink" title="Insert Link">🔗</button>
        <button type="button" @click="changeFontSize" title="Font Size">A</button>
        <button type="button" @click="changeTextColor" title="Text Color">C</button>
        
        <span class="separator">|</span>
        
        <button type="button" @click="formatText('removeFormat')" title="Clear Formatting">⌫</button>
        <button type="button" @click="formatText('undo')" title="Undo">↶</button>
        <button type="button" @click="formatText('redo')" title="Redo">↷</button>
      </div>
      <div 
        ref="editor"
        class="rich-editor"
        contenteditable="true"
        @input="updateContent"
        @focus="$event.target.style.outline = 'none'"
        data-placeholder="What are you pondering?"
      ></div>
      <button class="post_button" type="button" @click="handlePost">Post</button>
    </form>
  </div>
</template>

<style>
.createPostBox {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-light);
}

.createPostBox h1 {
  margin-top: 0;
  margin-bottom: 8px;
}

.rich-editor {
  min-height: 80px;
  max-height: 200px;
  padding: 10px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  background-color: white;
  overflow-y: auto;
  margin-bottom: 10px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.rich-editor:focus {
  outline: none;
  border-color: var(--primary);
}

.rich-editor:empty:before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
}

.editor-toolbar {
  display: flex;
  gap: 2px;
  margin-bottom: 5px;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-primary);
}

.editor-toolbar button {
  padding: 3px 5px;
  border: 1px solid var(--border-primary);
  background: white;
  border-radius: 2px;
  cursor: pointer;
  font-weight: bold;
  font-size: 11px;
  color: var(--text-primary);
  min-width: 20px;
  height: 20px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar button:hover {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--text-header);
}

.editor-toolbar button:active {
  background-color: var(--primary);
  color: white;
}

.separator {
  color: var(--border-primary);
  margin: 0 3px;
  font-size: 12px;
}

.rich-editor img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 4px 0;
}

.rich-editor a {
  color: var(--link-color);
  text-decoration: underline;
}

.rich-editor ul, .rich-editor ol {
  margin: 8px 0;
  padding-left: 20px;
}

.post_button {
  align-self: flex-end;
  padding: 8px 16px;
  background-color: var(--btn-post);
  color: var(--text-white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.post_button:hover {
  background-color: var(--btn-post-hover);
}
</style>