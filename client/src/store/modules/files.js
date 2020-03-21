import path from 'path';
import api from "../api";
import { errorToast, expandFile } from '../../utils';
import {
  SET_FILESLIST,
  SET_FILESLIST_LOADING,
  SET_FILESLIST_SELECTED,
  SET_FILESLIST_SELECT,
  SET_FILESLIST_LASTSELECTED,
  RENAME_FILE,
  SET_SEARCH,
  SET_SORT_ORDER
} from "../mutation-types";
import { SORT_NAME_ASC, SORT_NAME_DESC } from "../sort-types";

export default {
  state: {
    listFiles: [],
    isLoading: false,
    lastSelected: null,

    searching: '',

    sortOrder: SORT_NAME_ASC,
    sortOptions: {
      [SORT_NAME_ASC]: {
        value: SORT_NAME_ASC,
        label: "A-Z",
        icon: "sort-ascending",
        func: (file1, file2) => file1.name.localeCompare(file2.name) > 0
      },
      [SORT_NAME_DESC]: {
        value: SORT_NAME_DESC,
        label: "Z-A",
        icon: "sort-descending",
        func: (file1, file2) => file2.name.localeCompare(file1.name) > 0
      }
    }
  },
  mutations: {
    [SET_FILESLIST](state, files) {
      state.listFiles = files.map((file, index) => expandFile(file, index));
    },
    [SET_FILESLIST_LOADING](state, loading) {
      state.isLoading = loading;
    },

    [SET_FILESLIST_SELECTED](state, selected) {
      state.listFiles.forEach(file => {
        file.selected = false;
      });
      selected.forEach(file => {
        state.listFiles[file.index].selected = true;
      });
    },
    [SET_FILESLIST_SELECT](state, {file, select}) {
      state.listFiles[file.index].selected = select;
    },
    [SET_FILESLIST_LASTSELECTED](state, lastSelected) {
      state.lastSelected = lastSelected;
    },

    [RENAME_FILE](state, {file, newName}) {
      file = state.listFiles[file.index];
      file.p = path.join(path.dirname(file.p), newName);
      file.name = path.basename(file.p);
      file.ext = path.extname(file.p).slice(1);
    },

    [SET_SEARCH](state, input) {
      state.searching = input;
    },

    [SET_SORT_ORDER](state, order) {
      state.sortOrder = order;
    }
  },
  getters: {
    getSortedFilesList: state => () => {
      const files = (state.searching != '') ? [...state.listFiles].filter(file => file.name.toLowerCase().indexOf(state.searching.toLowerCase()) >= 0) : [...state.listFiles];
      return files.sort(state.sortOptions[state.sortOrder].func);
    },

    getListSelecedFiles: state => () => {
      return state.listFiles.filter(file => file.selected);
    },

    getSortOptionsList: state => {
      return Object.keys(state.sortOptions).map(key => state.sortOptions[key]);
    }
  },
  actions: {
    loadFiles(context, dir) {
      context.commit(SET_FILESLIST_LASTSELECTED, null);
      context.commit(SET_FILESLIST, []);
      context.commit(SET_FILESLIST_LOADING, true);
      return new Promise((resolve, reject) => {
        api
          .getFilesList(dir)
          .then(files => {
            context.commit(SET_FILESLIST, files);
            context.commit(SET_FILESLIST_LOADING, false);
            resolve("success");
          })
          .catch(err => {
            errorToast(err, 'Files failed to load.');
            reject(err);
          });
      });
    },

    setSelectedFiles(context, selected) {
      context.commit(SET_FILESLIST_SELECTED, selected);
    },
    addSelectedFiles(context, selected) {
      selected = [...selected, ...context.getters.getListSelecedFiles()];
      context.commit(SET_FILESLIST_SELECTED, selected);
    },
    removeSelectedFile(context, file) {
      context.commit(SET_FILESLIST_SELECT, {file, select:false});
    },
    setLastSelected(context, file) {
      context.commit(SET_FILESLIST_LASTSELECTED, file);
    },

    setFileName(context, {file, newName}) {
      return new Promise((resolve, reject) => {
        if (file.name === newName) return;
        api.renameFile(file.p, newName).then(() => {
          context.commit(RENAME_FILE, {file, newName});
          resolve("success");
        }).catch(err => {
          errorToast(err, `Failed to rename ${file.name} to ${newName}.`);
          reject(err);
        });
      });
    },

    setSearch(context, input) {
      context.commit(RESET_FILELIST_SELECTED);
      context.commit(SET_SEARCH, input);
    },

    setSortOrder(context, order) {
      context.commit(SET_SORT_ORDER, order);
    }
  }
};
