<template>
  <FilesDetails :data="filesList" :isLoading="isLoadingFilesList" :selected="getBooleanSelectedFiles" @click:file="clickFile" />
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import { errorToast } from "../../utils";
import FilesDetails from "./FilesDetails";

export default {
  name: "Files",
  components: {
    FilesDetails
  },
  computed: {
    ...mapState({
      isLoadingFilesList: state => state.files.isLoading
    }),
    ...mapGetters({
      getBooleanSelectedFiles: 'getBooleanSelectedFiles',
      filesList: 'getSortedFilesList'
    }),
    selectedFiles: {
      get: function() {
        return this.$store.getters.getListSelecedFiles();
      },
      set: function(selected) {
        this.$store.dispatch('setSelectedFiles', selected);
      }
    },
    lastSelected: {
      get: function() {
        return this.$store.state.selection.lastSelected;
      },
      set: function(file) {
        this.$store.dispatch('setLastSelected', file);
      }
    }
  },
  methods: {
    clickFile: function(file, modKey) {
      const isSelected = this.selectedFiles.findIndex(f => f.index == file.index) >= 0;
      if (modKey.ctrl && isSelected) {
        this.$store.dispatch('removeSelectedFile', file);
      } else {
        let selected = [file];
        if (modKey.shift && this.lastSelected) {
          const indexSelected = this.filesList.findIndex(f => f.index == file.index);
          const indexLastSelected = this.filesList.findIndex(f => f.index == this.lastSelected.index);
          const [startIndex, endIndex] = indexSelected > indexLastSelected ? [indexLastSelected, indexSelected] : [indexSelected, indexLastSelected];
          for (let i = startIndex; i <= endIndex; i++) {
            selected.push(this.filesList[i]);
          }
        }
        if (modKey.ctrl) {
          this.$store.dispatch('addSelectedFiles', selected);
        } else {
          this.selectedFiles = selected;
        } 
        this.lastSelected = file;
      }
    }
  }
}
</script>

<style>

</style>