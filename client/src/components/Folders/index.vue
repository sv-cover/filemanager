<template>
  <div class="folders">
    <aside class="menu">
      <p class="menu-label">
        Folders
      </p>
      <ul class="menu-list is-size-7">
        <li><b-progress v-if="isLoading" /></li>
        <Folder
          v-for="(folder, index) in folders"
          :key="index"
          :folder="folder"
          :currentFolder="currentFolder"
          @update:currentFolder="setCurrentFolder"
          @contextmenu="rightClick"
        />
      </ul>
    </aside>
    <RightClickMenu :visible.sync="rightClickMenu" :position="position">
      <FileMenu :targetFolder="rightClickFolder" />
    </RightClickMenu>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import { errorToast } from "../../utils";
import Folder from "./Folder";
import RightClickMenu from "../menu/RightClickMenu";
import FileMenu from "../menu/FileMenu";

export default {
  name: "Folders",
  components: {
    Folder,
    RightClickMenu,
    FileMenu
  },
  data() {
    return {
      rightClickMenu: false,
      position: {
        top: 0,
        left: 0
      },
      rightClickFolder: null
    };
  },
  computed: {
    ...mapState({
      folders: state => state.dir.listDirectories,
      isLoading: state => state.dir.isLoading
    }),
    currentFolder: {
      get: function() {
        return this.$store.getters.getCurrentDirectory;
      },
      set: function(dir) {
        this.$store.dispatch("setCurrentDir", dir);
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentFolderStore: "setCurrentDir"
    }),
    setCurrentFolder: function(event) {
      this.currentFolder = event;
    },
    rightClick: function(event, folder) {
      this.rightClickFolder = folder;
      this.position = {
        top: event.y,
        left: event.x
      };
      this.rightClickMenu = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.folders {
  height: 100%;
  width: 100%;
}
</style>
