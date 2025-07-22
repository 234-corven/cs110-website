<script>
import { useUserStore } from '../stores/user'
import { firestore } from '../firebaseResources.js'
import { collection, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore'

export default {
  data() {
    return {
      content: '',
      title: '',
      userDate: '', // User-specified date
      isImportant: false, // New important flag
      activeCommands: [],
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  mounted() {
    document.addEventListener('selectionchange', this.updateActiveCommands);
  },
  beforeUnmount() {
    document.removeEventListener('selectionchange', this.updateActiveCommands);
  },
  methods: {
    updateContent() {
      this.content = this.$refs.editor.innerHTML;
    },

    updateActiveCommands() {
      if (!this.$refs.editor || document.activeElement !== this.$refs.editor) return;
      const commands = [
        'bold', 'italic', 'underline', 'strikeThrough',
        'justifyLeft', 'justifyCenter', 'justifyRight',
        'insertOrderedList', 'insertUnorderedList'
      ];
      this.activeCommands = commands.filter(cmd => document.queryCommandState(cmd));
    },

    isActive(command) {
      return this.activeCommands.includes(command);
    },

    formatText(command, value = null) {
      document.execCommand(command, false, value);
      this.$refs.editor.focus();
      this.updateContent();
      this.updateActiveCommands();
    },

    toggleFormat(command, value = null) {
      this.formatText(command, value);
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
      const titleText = this.title.trim();
      
      if (plainText && titleText) {
        this.createPost(this.content, this.title, this.userDate, this.isImportant);
        this.$refs.editor.innerHTML = '';
        this.content = '';
        this.title = '';
        this.userDate = '';
        this.isImportant = false;
      } else {
        alert("Both title and content are required.");
      }
    },

    createPost(content, title, userDate, isImportant) {
      if (!this.userStore.user) {
        alert("You must be logged in to post.");
        return;
      }

      const postsCollection = collection(firestore, "posts");
      const newPost = {
        timestamp: serverTimestamp(), // Actual submission time
        author: this.userStore.user.id,
        title: title.trim(),
        content: content.trim(),
        userDate: userDate || null, // User-specified date (optional)
        isImportant: isImportant || false, // Add important flag
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
    },
  }
}
</script>

<template>
  <div class="createPostBox">
    <h1>Create a Post</h1>
    <form class="PostInput">
      <input 
        v-model="title" 
        type="text" 
        placeholder="Post title..." 
        class="title-input"
        required
      />
      <input 
        v-model="userDate" 
        type="date" 
        class="date-input"
        title="Optional: Specify a date for this post"
        placeholder="Post date (optional)"
      />
      <div class="editor-toolbar">
        <button type="button" :class="{ active: isActive('bold') }" @mousedown.prevent="toggleFormat('bold')" title="Bold">B</button>
        <button type="button" :class="{ active: isActive('italic') }" @mousedown.prevent="toggleFormat('italic')" title="Italic">I</button>
        <button type="button" :class="{ active: isActive('underline') }" @mousedown.prevent="toggleFormat('underline')" title="Underline">U</button>
        <button type="button" :class="{ active: isActive('strikeThrough') }" @mousedown.prevent="toggleFormat('strikeThrough')" title="Strikethrough">S</button>
        
        <span class="separator">|</span>
        
        <button type="button" :class="{ active: isActive('justifyLeft') }" @mousedown.prevent="toggleFormat('justifyLeft')" title="Align Left">⬅</button>
        <button type="button" :class="{ active: isActive('justifyCenter') }" @mousedown.prevent="toggleFormat('justifyCenter')" title="Center">↔</button>
        <button type="button" :class="{ active: isActive('justifyRight') }" @mousedown.prevent="toggleFormat('justifyRight')" title="Align Right">➡</button>
        
        <span class="separator">|</span>
        
        <button type="button" :class="{ active: isActive('insertOrderedList') }" @mousedown.prevent="toggleFormat('insertOrderedList')" title="Numbered List">#</button>
        <button type="button" :class="{ active: isActive('insertUnorderedList') }" @mousedown.prevent="toggleFormat('insertUnorderedList')" title="Bullet List">•</button>
        
        <span class="separator">|</span>
        
        <button type="button" @mousedown.prevent="insertLink" title="Insert Link">🔗</button>
        <button type="button" @mousedown.prevent="changeFontSize" title="Font Size">A</button>
        <button type="button" @mousedown.prevent="changeTextColor" title="Text Color">C</button>
        
        <span class="separator">|</span>
        
        <button type="button" @mousedown.prevent="toggleFormat('removeFormat')" title="Clear Formatting">⌫</button>
        <button type="button" @mousedown.prevent="toggleFormat('undo')" title="Undo">↶</button>
        <button type="button" @mousedown.prevent="toggleFormat('redo')" title="Redo">↷</button>
      </div>
      <div 
        ref="editor"
        class="rich-editor"
        contenteditable="true"
        @input="updateContent"
        @focus="$event.target.style.outline = 'none'"
        data-placeholder="What are you pondering?"
      ></div>
      <div class="important-checkbox">
        <input 
          v-model="isImportant" 
          type="checkbox" 
          id="important-check"
          class="checkbox-input"
        />
        <label for="important-check" class="checkbox-label">
          ⭐ Mark as Important Event
        </label>
      </div>
      <button class="post_button" type="button" @click="handlePost">Post</button>
    </form>
  </div>
</template>

<style>
.createPostBox {
  display: flex;
  flex-direction: column;
  width: 400px;
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
  width: 100%;
  box-sizing: border-box;
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

.editor-toolbar button.active {
  background-color: var(--primary-hover);
  color: var(--primary-color);
  border-color: var(--primary);
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

.title-input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;
}

.title-input:focus,
.date-input:focus {
  outline: none;
  border-color: var(--primary);
}

.date-input {
  width: 100%;
  padding: 8px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.important-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  border: 1px solid var(--border-primary);
}

.checkbox-input {
  margin-right: 8px;
  transform: scale(1.2);
}

.checkbox-label {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
  cursor: pointer;
}
</style>