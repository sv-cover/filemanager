import {
  SET_SEARCH,
  SET_SORT_ORDER
} from "../mutation-types";
import { SORT_NAME_ASC, SORT_NAME_DESC } from "../sort-types";

export default {
  state: {
    searching: "",

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
    [SET_SEARCH](state, input) {
      state.searching = input;
    },

    [SET_SORT_ORDER](state, order) {
      state.sortOrder = order;
    }
  },
  getters: {
    getSortedFilesList: (state, getters, rootState) => {
      let files = [...rootState.files.listFiles];
      if (state.searching != "") {
        files = files.filter(file => file.name.toLowerCase().indexOf(state.searching.toLowerCase()) >= 0)
      }
      return files.sort(state.sortOptions[state.sortOrder].func);
    },

    getSortOptionsList: state => {
      return Object.keys(state.sortOptions).map(key => state.sortOptions[key]);
    }
  },
  actions: {
    setSearch(context, input) {
      context.commit(RESET_FILELIST_SELECTED);
      context.commit(SET_SEARCH, input);
    },

    setSortOrder(context, order) {
      context.commit(SET_SORT_ORDER, order);
    }
  }
};
