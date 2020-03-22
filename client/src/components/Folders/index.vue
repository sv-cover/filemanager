<template>
  <aside class="menu">
    <p class="menu-label">
      Folders
    </p>
    <ul class="menu-list is-size-7">
      <li><b-progress v-if="isLoading" /></li>
      <Folder v-for="(folder, index) in folders" :key="index" :folder="folder" :currentFolder="currentFolder" v-on:update:currentFolder="setCurrentFolder" />
    </ul>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import { errorToast } from "../../utils";
import Folder from './Folder'

export default {
  name: 'Folders',
  components: {
    Folder
  },
  computed: {
    ...mapState({
      folders: state => state.dir.listDirectories,
      isLoading: state => state.dir.isLoading
    }),
    currentFolder: {
      get: function() {
        return this.$store.state.dir.currentDirectory;
      },
      set: function(dir) {
        this.$store.dispatch('setCurrentDir', dir);
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentFolderStore: 'setCurrentDir'
    }),
    setCurrentFolder: function (event) {
      this.currentFolder = event;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
