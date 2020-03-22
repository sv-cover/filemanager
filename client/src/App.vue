<template>
  <div id="app">
    <TopMenu/>
    <section class="section main">
      <b-loading :active="isLoadingConfig" />
      <div v-if="!isLoadingConfig" class="mainView">
        <div class="folder has-background-light">
          <Folders
            :folders="directories"
            :currentFolder.sync="currentDirectory"
            :isLoading="isLoadingDirList"
          />
        </div>
        <div class="files ">
          <FilesDetails :data="filesList" :isLoading="isLoadingFilesList" :selected="getBooleanSelectedFiles" @click:file="clickFile" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { errorToast } from "./utils";

import TopMenu from "./components/menu/TopMenu";
import Folders from "./components/Folders";
import FilesDetails from "./components/FilesDetails";

export default {
  name: "Fileman",
  components: {
    TopMenu,
    Folders,
    FilesDetails
  },
  computed: {
    ...mapState({
      directories: state => state.dir.listDirectories,
      isLoadingDirList: state => state.dir.isLoading,
      isLoadingFilesList: state => state.files.isLoading
    }),
    ...mapGetters({
      isLoadingConfig: 'isLoadingConfig',
      getBooleanSelectedFiles: 'getBooleanSelectedFiles'
    }),
    filesList: function() {
      return this.$store.getters.getSortedFilesList;
    },
    currentDirectory: {
      get: function() {
        return this.$store.state.dir.currentDirectory;
      },
      set: function(dir) {
        this.$store.dispatch('setCurrentDir', dir);
      }
    },
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
    ...mapActions({
      setCurrentFolderStore: 'setCurrentDir'
    }),
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
  },
  mounted() {
    this.$store.dispatch("loadConfig").catch(errorToast);
  }
};
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
@import "./styles/bulmaVariables.scss";

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

#app {
  display: flex;
  flex-flow: column;
  height: 100vh;
}
.section.main {
  flex-grow: 1;
  padding: 0;
}
.mainView {
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
}
.folder {
  height: 100%;
  width: 20%;
  overflow-x: scroll;
  padding: 1rem;
  white-space: nowrap;
}
.files {
  height: 100%;
  flex-grow: 1;
}
</style>
