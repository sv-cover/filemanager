<template>
  <div id="app">
    <Menu />
    <section class="section main">
      <b-loading :is-full-page="false" :active.sync="hasLoadedConfig">
      </b-loading>
      <div class="columns">
        <div class="column is-one-fifth">
          <FolderTree/>
        </div>
        <div class="column">
          Files
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Menu from "./components/menu/TopMenu.vue"
import FolderTree from "./components/FolderTree.vue"

export default {
  name: "Fileman",
  components: {
    Menu,
    FolderTree
  },
  computed: {
    isLoadingConfig () {
      return !this.$store.getters.hasLoadedConfig
    }
  },
  created () {
    this.$store.dispatch('loadConfig')
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
}
</style>
