<template>
  <div id="app">
    <TopMenu />
    <section class="section main">
      <b-loading :is-full-page="false" :active="isLoadingConfig">
      </b-loading>
      <div v-if="hasLoadedConfig" class="mainView">
        <div class="folder has-background-light">
          <Folders :folders="directories" :currentFolder="currentDirectory" v-on:update:currentFolder="changeCurrentFolder"></Folders>
        </div>
        <div class="files ">
          <FilesDetails/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState,  mapGetters, mapMutations } from 'vuex'
import { errorToast } from "./utils";

import TopMenu from "./components/menu/TopMenu.vue"
import Folders from "./components/Folders"
import FilesDetails from "./components/FilesDetails.vue"

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
      currentDirectory: state => state.dir.currentDirectory
    }),
    ...mapGetters([
      'hasLoadedConfig'
    ]),
    isLoadingConfig () {
      return !this.$store.getters.hasLoadedConfig
    }
  },
  methods: {
    ...mapMutations({
      setCurrentFolder: 'SET_CURRENT_DIR'
    }),
    changeCurrentFolder: function (event) {
      this.setCurrentFolder(event.p)
    }
  },
  mounted () {
    this.$store.dispatch('loadConfig').then( (msg) => {
      if (msg === 'success') {
        this.$store.dispatch('loadDirList')
      }
    }).catch(errorToast)
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
  padding: 1.0rem;
  white-space: nowrap;
}
.files {
  height: 100%;
  flex-grow: 1;
}
</style>
