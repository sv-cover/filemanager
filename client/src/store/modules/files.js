import api from "../api";
import { SET_FILESLIST, SET_FILESLIST_LOADING } from "../mutation-types";

export default {
  state: {
    selectedFiles: [],
    listFiles: [],
    isLoading: false
  },
  mutations: {
    [SET_FILESLIST](state, files) {
      state.listFiles = files;
    },
    [SET_FILESLIST_LOADING](state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    loadFiles(context, dir) {
      context.commit(SET_FILESLIST_LOADING, true);
      return new Promise((resolve, reject) => {
        api
          .getFilesList(dir.p)
          .then(files => {
            console.log(files);
            context.commit(SET_FILESLIST, files);
            context.commit(SET_FILESLIST_LOADING, false);
            resolve("success");
          })
          .catch(reject);
      });
    }
  }
};
