import { errorToast } from "../../utils";
import api from "../api";
import { SET_DIRLIST, SET_CURRENT_DIR, SET_DIRLIST_LOADING } from "../mutation-types";

export default {
  state: {
    currentDirectory: '',
    listDirectories: [],
    isLoading: false
  },
  mutations: {
    [SET_DIRLIST](state, directories) {
      state.listDirectories = directories;
    },
    [SET_CURRENT_DIR](state, currentDir) {
      state.currentDirectory = currentDir;
    },
    [SET_DIRLIST_LOADING](state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    loadDirList(context) {
      return new Promise((resolve, reject) => {
        api
          .getDirList()
          .then(dirList => {
            context.commit(SET_DIRLIST, dirList);
            resolve("success");
          })
          .catch(reject);
      });
    },
    setCurrentDir(context, dir) {
      context.commit(SET_CURRENT_DIR, dir.p);
      context.dispatch('loadFiles', dir);
    } 
  },
  modules: {
  }
}