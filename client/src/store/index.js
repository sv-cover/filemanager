import Vue from "vue";
import Vuex from "vuex";
import ui from "./modules/ui";
import dir from "./modules/directory";
import files from "./modules/files";
import api from "./api";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {
    loadViewState(context) {
      context.dispatch("loadDirList");
      context.dispatch('loadFiles', context.state.dir.currentDirectory);
    },

    uploadFiles(context, {path, files}) {
      return new Promise((resolve, reject) => {
        api.uploadFiles(path, files).then(() => {
          context.dispatch('loadViewState');
          resolve('succes');
        }).catch(reject);
      })
    },
  },
  modules: {
    ui: ui,
    dir: dir,
    files: files
  }
});
