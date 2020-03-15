import { errorToast } from "../../utils";
import api from "../api";
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
    hasLoadedConfig: state => {
      return state.config !== null
    }
  },
  actions: {
    loadConfig(context) {
      return api
        .getConfig()
        .then(config => {
          context.commit(SET_CONFIG, config);
        })
        .catch(errorToast);
    }
  },
  modules: {}
};
