import { SET_CLIPBOARD, SET_CLIPBOARD_CUT } from '../mutation-types';

export default {
  state: {
    clipboard: [],
    cut: false
  },
  mutations: {
    [SET_CLIPBOARD](state, payload) {
      state.clipboard = payload;
    },
    [SET_CLIPBOARD_CUT](state, payload) {
      state.cut = payload;
    }
  },
  actions: {
    setClipboard(context, {selection, cut=false}) {
      context.commit(SET_CLIPBOARD, selection);
      context.commit(SET_CLIPBOARD_CUT, cut);
    },
    getClipboard(context) {
      const result = context.state.clipboard;
      context.commit(SET_CLIPBOARD, []);
      return result;
    }
  }
};