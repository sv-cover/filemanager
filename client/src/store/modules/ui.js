import api from "../api";
import { errorToast } from "../../utils";
import { SET_CONFIG, SET_VIEW } from "../mutation-types";
import { VIEW_DETAILS, VIEW_THUMBS } from "../view-types";

export default {
  state: {
    config: null,
    view: VIEW_DETAILS,
    viewOptions: [
      {
        value: VIEW_DETAILS,
        label: "Details",
        icon: "format-list-bulleted"
      },
      {
        value: VIEW_THUMBS,
        label: "Thumbnails",
        icon: "file-image"
      }
    ]
  },
  mutations: {
    [SET_CONFIG](state, config) {
      state.config = config;
    },
    [SET_VIEW](state, view) {
      state.view = view;
    }
  },
  getters: {
    isLoadingConfig: state => {
      return state.config === null;
    }
  },
  actions: {
    async loadConfig(context) {
      await api
        .getConfig()
        .then(config => {
          context.commit(SET_CONFIG, config);
        })
        .catch(err => {
          throw { msg: "UI config failed to load", err: err };
        });
    },
    setView(context, view) {
      context.commit(SET_VIEW, view);
    }
  }
};
