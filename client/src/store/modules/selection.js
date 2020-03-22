import { errorToast } from "../../utils";
import {
  SET_FILESLIST_SELECTED,
  SET_FILESLIST_SELECT,
  SET_FILESLIST_LASTSELECTED
} from "../mutation-types";

export default {
  state: {
    lastSelected: null,
    selected: new Set()
  },
  mutations: {
    [SET_FILESLIST_SELECTED](state, selected) {
      state.selected = new Set(selected.map(file => file.name));
    },
    [SET_FILESLIST_SELECT](state, { file, select }) {
      if (select) state.selected.add(file.name);
      else state.selected.delete(file.name);
      state.selected = new Set([...state.selected]);
    },
    [SET_FILESLIST_LASTSELECTED](state, lastSelected) {
      state.lastSelected = lastSelected;
    }
  },
  getters: {
    getListSelecedFiles: (state, getters, rootState) => () => {
      return rootState.files.listFiles.filter(file =>
        state.selected.has(file.name)
      );
    },
    getBooleanSelectedFiles: (state, getters, rootState) =>
      rootState.files.listFiles.map(file => state.selected.has(file.name)),
    isInSelected: state => file => state.selected.has(file.name)
  },
  actions: {
    setSelectedFiles(context, selected) {
      context.commit(SET_FILESLIST_SELECTED, selected);
    },
    addSelectedFiles(context, selected) {
      selected = [...selected, ...context.getters.getListSelecedFiles()];
      context.commit(SET_FILESLIST_SELECTED, selected);
    },
    removeSelectedFile(context, file) {
      context.commit(SET_FILESLIST_SELECT, { file, select: false });
    },
    setLastSelected(context, file) {
      context.commit(SET_FILESLIST_LASTSELECTED, file);
    }
  }
};
