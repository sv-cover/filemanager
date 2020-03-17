import store from "../index";
import { fetchData, formatApiUrL } from "../../utils";

export default {
  getConfig() {
    return fetchData("conf.json", "GET");
  },

  getDirList() {
    return fetchData(store.state.ui.config.DIRLIST);
  },

  getFilesList(path) {
    return fetchData(store.state.ui.config.FILESLIST, undefined, { d: path });
  }
};
