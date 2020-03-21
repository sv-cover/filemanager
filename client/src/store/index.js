import Vue from "vue";
import Vuex from "vuex";
import ui from "./modules/ui";
import dir from "./modules/directory";
import files from "./modules/files";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    loadViewState(context) {
      context.dispatch("loadDirList");
      context.dispatch("loadFiles", context.state.dir.currentDirectory);
    }
  },
  modules: {
    ui: ui,
    dir: dir,
    files: files
  }
});
