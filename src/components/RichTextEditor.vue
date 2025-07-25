<template>
  <div>
    <div class="editor-toolbar">
      <button type="button" :class="{ active: isActive('bold') }" @mousedown.prevent="formatText('bold')">B</button>
      <button type="button" :class="{ active: isActive('italic') }" @mousedown.prevent="formatText('italic')">I</button>
      <button type="button" :class="{ active: isActive('underline') }" @mousedown.prevent="formatText('underline')">U</button>
      <button type="button" :class="{ active: isActive('strikeThrough') }" @mousedown.prevent="formatText('strikeThrough')">S</button>
      <span class="separator">|</span>
      <button type="button" :class="{ active: isActive('justifyLeft') }" @mousedown.prevent="formatText('justifyLeft')">⬅</button>
      <button type="button" :class="{ active: isActive('justifyCenter') }" @mousedown.prevent="formatText('justifyCenter')">↔</button>
      <button type="button" :class="{ active: isActive('justifyRight') }" @mousedown.prevent="formatText('justifyRight')">➡</button>
      <span class="separator">|</span>
      <button type="button" :class="{ active: isActive('insertOrderedList') }" @mousedown.prevent="formatText('insertOrderedList')">#</button>
      <button type="button" :class="{ active: isActive('insertUnorderedList') }" @mousedown.prevent="formatText('insertUnorderedList')">•</button>
      <span class="separator">|</span>
      <button type="button" @mousedown.prevent="insertLink">🔗</button>
      <button type="button" @mousedown.prevent="changeFontSize">A</button>
      <button type="button" @mousedown.prevent="changeTextColor">C</button>
      <span class="separator">|</span>
      <button type="button" @mousedown.prevent="formatText('removeFormat')">⌫</button>
      <button type="button" @mousedown.prevent="formatText('undo')">↶</button>
      <button type="button" @mousedown.prevent="formatText('redo')">↷</button>
    </div>
    <div
      ref="editor"
      :class="editorClass"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="updateContent"
      @focus="$event.target.style.outline = 'none'"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Type here...'
    },
    editorClass: {
      type: String,
      default: 'rich-editor'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      activeCommands: [],
    }
  },
  mounted() {
    this.$refs.editor.innerHTML = this.modelValue;
    document.addEventListener('selectionchange', this.updateActiveCommands);
  },
  beforeUnmount() {
    document.removeEventListener('selectionchange', this.updateActiveCommands);
  },
  watch: {
    modelValue(newVal) {
      if (this.$refs.editor && this.$refs.editor.innerHTML !== newVal) {
        this.$refs.editor.innerHTML = newVal;
      }
    }
  },
  methods: {
    updateContent() {
      this.$emit('update:modelValue', this.$refs.editor.innerHTML);
      this.updateActiveCommands();
    },
    formatText(command, value = null) {
      document.execCommand(command, false, value);
      this.$refs.editor.focus();
      this.updateContent();
      this.updateActiveCommands();
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
    }
  }
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  gap: 2px;
  margin-bottom: 0px;
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
  background-color: var(--rte-bg-active-color);
  color: var(--rte-active-color);
  border-color: var(--primary);
}

.separator {
  color: var(--border-primary);
  margin: 0 3px;
  font-size: 12px;
}

.rich-editor {
  min-height: 80px;
  max-height: 200px;
  width: 100%;
  padding: 10px;
  border: 2px solid var(--border-primary);
  border-radius: 4px;
  background-color: white;
  overflow-y: auto;
  margin-bottom: 0px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  box-sizing: border-box;
  display: block;
  visibility: visible;
  opacity: 1;
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
</style>
