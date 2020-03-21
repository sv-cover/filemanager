import api from "../api";
import { errorToast } from "../../utils";
import { SET_CONFIG } from "../mutation-types";

export default {
  state: {
    config: null
  },
  mutations: {
    [SET_CONFIG](state, config) {
      state.config = config;
    }
  },
  getters: {
    isLoadingConfig: state => {
      return state.config === null;
    }
  },
  actions: {
    loadConfig(context) {
      return new Promise((resolve, reject) => {
        api
          .getConfig()
          .then(config => {
            context.commit(SET_CONFIG, config);
            context.dispatch("loadDirList");
            resolve("success");
          })
          .catch(err => {
            errorToast(err, "UI failed to load.");
            reject(err);
          });
      });
    }
  }
};
