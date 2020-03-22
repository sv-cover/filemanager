import path from "path";
import api from "../api";
import { errorToast, expandFile } from "../../utils";
import {
  SET_FILESLIST,
  SET_FILESLIST_LOADING,
  SET_FILESLIST_LASTSELECTED,
  RENAME_FILE
} from "../mutation-types";

export default {
  state: {
    listFiles: [],
    isLoading: false,
    lastSelected: null
  },
  mutations: {
    [SET_FILESLIST](state, files) {
      state.listFiles = files.map((file, index) => expandFile(file, index));
    },
    [SET_FILESLIST_LOADING](state, loading) {
      state.isLoading = loading;
    },

    [RENAME_FILE](state, { file, newName }) {
      file = state.listFiles[file.index];
      file.p = path.join(path.dirname(file.p), newName);
      file.name = path.basename(file.p);
      file.ext = path.extname(file.p).slice(1);
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
            errorToast(err, "Files failed to load.");
            reject(err);
          });
      });
    },

    uploadFiles(context, { path, files }) {
      return new Promise((resolve, reject) => {
        api
          .uploadFiles(path, files)
          .then(() => {
            context.dispatch("loadViewState");
            resolve("succes");
          })
          .catch(err => {
            errorToast(err, "Files failed to load.");
            reject(err);
          });
      });
    },

    async moveFiles(context, {target, files}) {
      for (let i = 0; i < files.length; i++) {
        await api.moveFile(files[i].p, path.join(target, files[i].name)).catch(err => errorToast(err, "Files failed to move"));
        context.dispatch('loadViewState');
      }
    },
    async copyFiles(context, {target, files}) {
      for (let i = 0; i < files.length; i++) {
        await api.copyFile(files[i].p, path.join(target, files[i].name)).catch(err => errorToast(err, "Files failed to copy"));
        context.dispatch('loadViewState');
      }
    },
    async deleteFiles(context, files) {
      for (let i = 0; i < files.length; i++) {
        await api.deleteFile(files[i].p);
        context.dispatch('loadViewState');
      }
    },
    renameFile(context, { file, newName }) {
      return new Promise((resolve, reject) => {
        if (file.name === newName) return;
        api
          .renameFile(file.p, newName)
          .then(() => {
            context.commit(RENAME_FILE, { file, newName });
            resolve("success");
          })
          .catch(err => {
            errorToast(err, `Failed to rename ${file.name} to ${newName}.`);
            reject(err);
          });
      });
    },
  }
};
