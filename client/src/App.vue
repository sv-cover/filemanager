<template>
  <div id="app">
    <TopMenu />
    <section class="section main">
      <b-loading :active="isLoadingConfig" />
      <div v-if="!isLoadingConfig" class="mainView">
        <div class="folder has-background-light column is-one-quarter">
          <Folders />
        </div>
        <div class="files column">
          <Files />
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
import Files from "./components/Files";

export default {
  name: "Fileman",
  components: {
    TopMenu,
    Folders,
    Files
  },
  computed: {
    ...mapGetters({
      isLoadingConfig: "isLoadingConfig"
    })
  },
  mounted() {
    this.$store.dispatch("init");
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
  overflow-x: scroll;
  padding: 1rem;
  white-space: nowrap;
}
.files {
  height: 100%;
}
</style>
