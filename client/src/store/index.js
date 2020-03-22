import Vue from "vue";
import Vuex from "vuex";
import ui from "./modules/ui";
import dir from "./modules/directory";
import files from "./modules/files";
import sorting from "./modules/sorting";
import selection from "./modules/selection";
import clipboard from "./modules/clipboard";

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
    files: files,
    sorting,
    selection,
    clipboard
  }
});
