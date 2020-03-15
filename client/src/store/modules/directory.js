import { errorToast } from "../../utils";
import api from "../api";
import { SET_DIRLIST, SET_CURRENT_DIR } from "../mutation-types";

export default {
  state: {
    currentDirectory: '',
    listDirectories: []
  },
  mutations: {
    [SET_DIRLIST](state, directories) {
      state.listDirectories = directories;
    },
    [SET_CURRENT_DIR](state, currentDir) {
      state.currentDirectory = currentDir;
    }
  },
  actions: {
    loadDirList(context) {
      return api
        .getDirList()
        .then(dirList => {
          context.commit(SET_DIRLIST, dirList);
        })
        .catch(errorToast);
    }
  },
  modules: {
  }
}