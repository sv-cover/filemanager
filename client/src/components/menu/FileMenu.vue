<template>
  <aside class="menu">
    <ul class="menu-list">
      <Upload v-if="hasUpload" :currentFolder="currentDirectory" />
      <FileMenuItem v-if="hasPreview" :disabled="!isOne" icon="monitor" @click="preview()">
        Preview
      </FileMenuItem>
      <FileMenuItem
        v-for="(o, i) in options"
        :key="i"
        :disabled="!o.enabled"
        :icon="o.icon"
        @click="o.click()"
      >
        {{ o.label }}
      </FileMenuItem>
    </ul>
  </aside>
</template>

<script>
import { ToastProgrammatic as Toast } from "buefy";
import { MapState } from 'vuex'

import FileMenuItem from "./FileMenuItem";
import Upload from './Upload';
import PreviewModal from "./PreviewModal";

export default {
  name: "FileMenu",
  components: {
    FileMenuItem,
    Upload
  },
  props: {
    hasUpload: {
      type: Boolean,
      default: false
    },
    hasPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isEmpty: vm => vm.selectedFiles.length == 0,
    isOne: vm => vm.selectedFiles.length == 1,
    clipboard: vm => vm.$store.state.clipboard.clipboard.length > 0,
    options: vm => {
      return [
        {
          label: "Download",
          icon: "download",
          enabled: !vm.isOne,
          click: vm.notImplemented
        },
        {
          label: "New Folder",
          icon: "folder-plus",
          enabled: vm.isEmpty,
          click: vm.notImplemented
        },
        {
          label: "Cut",
          icon: "content-cut",
          enabled: !vm.isEmpty,
          click: vm.cut
        },
        {
          label: "Copy",
          icon: "content-copy",
          enabled: !vm.isEmpty,
          click: vm.copy
        },
        {
          label: "Paste",
          icon: "content-paste",
          enabled: vm.clipboard,
          click: vm.paste
        },
        {
          label: "Delete",
          icon: "delete",
          enabled: !vm.isEmpty,
          click: vm.delete
        },
        {
          label: "Rename",
          icon: "pencil",
          enabled: vm.isOne,
          click: vm.rename
        }
      ];
    },
    selectedFiles: {
      get: function() {
        return this.$store.getters.getListSelecedFiles();
      },
      set: function(selected) {
        this.$store.dispatch("setSelectedFiles", selected);
      }
    },
    currentDirectory: {
      get: function() {
        return this.$store.state.dir.currentDirectory;
      },
      set: function(dir) {
        this.$store.dispatch('setCurrentDir', dir);
      }
    },
  },
  methods: {
    notImplemented: function(element) {
      this.$buefy.toast.open({
        duration: 1000,
        message: `Not implemented yet`,
        type: "is-warning"
      });
    },
    preview: function() {
      this.$buefy.modal.open({
        parent: this,
        component: PreviewModal,
        props: {
          file: this.selectedFiles[0]
        }
      });
    },
    upload: function() {
      this.$buefy.dialog.prompt({
        message: "Upload files",
        inputAttrs: {
          type: "file"
        },
        trapFocus: true,
        onConfirm: value => console.log(value)
      });
    },
    cut: function() {
      this.$store.dispatch('setClipboard', {selection: this.selectedFiles, cut: true});
    },
    copy: function() {
      this.$store.dispatch('setClipboard', {selection: this.selectedFiles});
    },
    paste: function() {
      this.$store.dispatch('getClipboard').then(files => {
        if (this.$store.state.clipboard.cut) {
          this.$store.dispatch('moveFiles', {target: this.currentDirectory, files: files});
        } else {
          this.$store.dispatch('copyFiles', {target: this.currentDirectory, files: files});
        }
      })
    },
    delete: function() {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete these files?',
        trapFocus: true,
        onConfirm: () => this.$store.dispatch('deleteFiles', this.selectedFiles)
      });
      
    },
    rename: function() {
      this.$buefy.dialog.prompt({
        message: `New name for ` + this.selectedFiles[0].name,
        inputAttrs: {
          value: this.selectedFiles[0].name
        },
        trapFocus: true,
        onConfirm: value =>
          this.$store.dispatch("renameFile", {
            file: this.selectedFiles[0],
            newName: value
          })
      });
    }
  }
};
</script>

<style></style>
