<template>
  <aside class="menu">
    <ul class="menu-list">
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

import FileMenuItem from "./FileMenuItem";
import PreviewModal from "./PreviewModal";

export default {
  name: "FileMenu",
  components: {
    FileMenuItem
  },
  computed: {
    isEmpty: vm => vm.selectedFiles.length == 0,
    isOne: vm => vm.selectedFiles.length == 1,
    options: vm => {
      return [
        {
          label: "Preview",
          icon: "monitor",
          enabled: vm.isOne,
          click: vm.preview
        },
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
          click: vm.notImplemented
        },
        {
          label: "Copy",
          icon: "content-copy",
          enabled: !vm.isEmpty,
          click: vm.notImplemented
        },
        {
          label: "Paste",
          icon: "content-paste",
          enabled: vm.isEmpty,
          click: vm.notImplemented
        },
        {
          label: "Delete",
          icon: "delete",
          enabled: !vm.isEmpty,
          click: vm.notImplemented
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
    }
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
    rename: function() {
      this.$buefy.dialog.prompt({
        message: `New name for ` + this.selectedFiles[0].name,
        inputAttrs: {
          placeholder: "example.png",
           value: this.selectedFiles[0].name
        },
        trapFocus: true,
        onConfirm: value => this.$store.dispatch('setFileName', {file: this.selectedFiles[0], newName: value})
      });
    }
  }
};
</script>

<style></style>
