import { basename } from "path";
import api from "../api";
import { SET_FILESLIST, SET_FILESLIST_LOADING, RESET_FILELIST_SELECTED, ADD_FILESLIST_SELECTED, SET_FILESLIST_SELECT, SET_FILESLIST_LASTSELECTED } from "../mutation-types";

export default {
  state: {
    listFiles: [],
    isLoading: false,
    sortOrder: null,
    lastSelected: null
  },
  mutations: {
    [SET_FILESLIST](state, files) {
      state.listFiles = files.map((file, index) => {
        file.index = index;
        file.name = basename(file.p);
        file.selected = false;
        return file;
      });
    },
    [SET_FILESLIST_LOADING](state, loading) {
      state.isLoading = loading;
    },
    [RESET_FILELIST_SELECTED](state) {
      state.listFiles.forEach(file => {
        file.selected = false;
      });
    },
    [ADD_FILESLIST_SELECTED](state, selected) {
      selected.forEach(file => {
        state.listFiles[file.index].selected = true;
      });
    },
    [SET_FILESLIST_SELECT](state, file, select) {
      state.listFiles[file.index].selected = select;
    },
    [SET_FILESLIST_LASTSELECTED](state, lastSelected) {
      state.lastSelected = lastSelected;
    },
  },
  getters: {
    getSortedFilesList: (state) => () => {
      return [...state.listFiles].sort((file1, file2) => file1.name.localeCompare(file2.name));
    },
    getListSelecedFiles: (state) => () => {
      return state.listFiles.filter(file => file.selected);
    }
  },
  actions: {
    loadFiles(context, dir) {
      context.commit(SET_FILESLIST_LASTSELECTED, null);
      context.commit(SET_FILESLIST, []);
      context.commit(SET_FILESLIST_LOADING, true);
      return new Promise((resolve, reject) => {
        api
          .getFilesList(dir.p)
          .then(files => {
            context.commit(SET_FILESLIST, files);
            context.commit(SET_FILESLIST_LOADING, false);
            resolve("success");
          })
          .catch(reject);
      });
    },
    setSelectedFiles(context, selected) {
      context.commit(RESET_FILELIST_SELECTED);
      context.commit(ADD_FILESLIST_SELECTED, selected);
    },
    addSelectedFiles(context, selected) {
      context.commit(ADD_FILESLIST_SELECTED, selected);
    },
    removeSelectedFile(context, file) {
      context.commit(SET_FILESLIST_SELECT, file, false);
    },
    setLastSelected(context, file) {
      context.commit(SET_FILESLIST_LASTSELECTED, file);
    }
  }
};
