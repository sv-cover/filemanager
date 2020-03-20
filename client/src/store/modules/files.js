import { basename } from "path";
import api from "../api";
import {
  SET_FILESLIST,
  SET_FILESLIST_LOADING,
  RESET_FILELIST_SELECTED,
  ADD_FILESLIST_SELECTED,
  SET_FILESLIST_SELECT,
  SET_FILESLIST_LASTSELECTED,
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
