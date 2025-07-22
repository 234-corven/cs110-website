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
/* Only include the shared toolbar styles here. Each parent can pass its own editorClass for editor box styling. */
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
</style>
