<template>
  <aside class="menu">
    <ul class="menu-list">
      <li><Upload v-if="hasUpload" :currentFolder="currentDirectory" /></li>
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
import { mapState, mapGetters, } from 'vuex'

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
    },
    targetFolder: {
      type: Object,
      default: null
    }
  },
  computed: {
    currentDirectory: vm => {
      if (vm.targetFolder === null) return vm.$store.getters.getCurrentDirectory;
      else return vm.targetFolder.p;
    },
    selectedItems: vm => {
      if (vm.targetFolder === null) return vm.$store.getters.getListSelecedItems;
      else return [vm.targetFolder];
    },
    isEmpty: vm => vm.selectedItems.length == 0,
    isOne: vm => vm.selectedItems.length == 1,
    canCreateFolder: vm => vm.selectedItems.filter(i => i.type == "DIRECTORY").length || vm.isEmpty,
    clipboard: vm => vm.$store.state.clipboard.clipboard.length > 0,
    options: vm => {
      return [
        {
          label: "Download",
          icon: "download",
          enabled: !vm.isEmpty,
          click: vm.notImplemented
        },
        {
          label: "New Folder",
          icon: "folder-plus",
          enabled: vm.canCreateFolder,
          click: vm.createFolder
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
          file: this.selectedItems[0]
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
    createFolder: function() {
      this.$buefy.dialog.prompt({
        message: "Create new folder",
        inputAttrs: {
          placeholder: "Input the name of the new folder here"
        },
        trapFocus: true,
        onConfirm: value =>
          this.$store.dispatch("createDir", {
            path: this.currentDirectory,
            name: value
          })
      });
    },
    cut: function() {
      this.$store.dispatch('setClipboard', {selection: this.selectedItems, cut: true});
    },
    copy: function() {
      this.$store.dispatch('setClipboard', {selection: this.selectedItems});
    },
    paste: function() {
      this.$store.dispatch('getClipboard').then(files => {
        if (this.$store.state.clipboard.cut) {
          this.$store.dispatch('move', {target: this.currentDirectory, items: files});
        } else {
          this.$store.dispatch('copy', {target: this.currentDirectory, items: files});
        }
      })
    },
    delete: function() {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete these files?',
        trapFocus: true,
        onConfirm: () => this.$store.dispatch('delete', this.selectedItems)
      });
      
    },
    rename: function() {
      this.$buefy.dialog.prompt({
        message: `New name for ` + this.selectedItems[0].name,
        inputAttrs: {
          value: this.selectedItems[0].name
        },
        trapFocus: true,
        onConfirm: value =>
          this.$store.dispatch("rename", {
            item: this.selectedItems[0],
            newName: value
          })
      });
    }
  }
};
</script>

<style></style>
