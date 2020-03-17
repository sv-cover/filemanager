<template>
  <div id="app">
    <TopMenu />
    <section class="section main">
      <b-loading :active="isLoadingConfig" />
      <div v-if="hasLoadedConfig" class="mainView">
        <div class="folder has-background-light">
          <Folders
            :folders="directories"
            :currentFolder="currentDirectory"
            v-on:update:currentFolder="setCurrentFolder"
            :loading="isLoadingDirList"
          />
        </div>
        <div class="files ">
          <FilesDetails :data="filesList" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { errorToast } from "./utils";

import TopMenu from "./components/menu/TopMenu.vue";
import Folders from "./components/Folders";
import FilesDetails from "./components/FilesDetails.vue";

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
      currentDirectory: state => state.dir.currentDirectory,
      isLoadingDirList: state => state.dir.isLoading,
      filesList: state => state.files.listFiles
    }),
    ...mapGetters(["isLoadingConfig"]),
    hasLoadedConfig() {
      return !this.$store.getters.isLoadingConfig;
    }
  },
  methods: {
    ...mapActions({
      setCurrentFolder: 'setCurrentDir'
    })
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
