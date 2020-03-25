import Vue from "vue";
import Vuex from "vuex";
import ui from "./modules/ui";
import dir from "./modules/directory";
import files from "./modules/files";
import sorting from "./modules/sorting";
import selection from "./modules/selection";
import clipboard from "./modules/clipboard";

Vue.use(Vuex);

function seperateFilesAndFolders(items) {
  return {
    files: items.filter(item => item.type === "FILE"),
    dirs: items.filter(item => item.type === "DIRECTORY")
  }
}

export default new Vuex.Store({
  actions: {
    async loadViewState(context) {
      await context.dispatch("loadDirList");
      await context.dispatch("loadFiles", context.getters.getCurrentDirectory);
    },
    move(context, {items, target}) {
      const {files, dirs} = seperateFilesAndFolders(items);
      context.dispatch("moveFiles", {files, target});
      context.dispatch("moveDirs", {dirs, target});
      context.dispatch('loadViewState');
    },
    copy(context, {items, target}) {
      const {files, dirs} = seperateFilesAndFolders(items);
      context.dispatch("copyFiles", {files, target});
      context.dispatch("copyDirs", {dirs, target});
      context.dispatch('loadViewState');
    },
    delete(context, items) {
      const {files, dirs} = seperateFilesAndFolders(items);
      context.dispatch("deleteFiles", files);
      context.dispatch("deleteDirs", dirs);
      context.dispatch('loadViewState');
    },
    rename(context, {item, newName}) {
      if (item.type === "FILE") {
        context.dispatch("renameFile", {file: item, newName: newName});
      } else if (item.type === "DIRECTORY") {
        context.dispatch("renameDir", {dir: item, newName: newName});
      }
    },
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
