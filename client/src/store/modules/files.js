import path from "path";
import api from "../api";
import { errorToast, expandFile, getIndex } from "../../utils";
import {
  SET_FILESLIST,
  SET_FILESLIST_LOADING,
  SET_FILESLIST_LASTSELECTED,
  ADD_FILE_FILELIST,
  REMOVE_FILE_FILELIST,
  RENAME_FILE_FILELIST
} from "../mutation-types";

function isInFolder(filePath, folderPath) {
  return folderPath === path.dirname(filePath);
}

function copyFileData(file, target) {
  return expandFile({
    p: path.join(target, file.name),
    t: file.t,
    s: file.s,
    h: file.h,
    w: file.w
  });
}

export default {
  state: {
    listFiles: [],
    isLoading: false
  },
  mutations: {
    [SET_FILESLIST](state, files) {
      state.listFiles = files.map(file => expandFile(file));
    },
    [SET_FILESLIST_LOADING](state, loading) {
      state.isLoading = loading;
    },

    [ADD_FILE_FILELIST](state, file) {
      state.listFiles.push(file);
    },
    [REMOVE_FILE_FILELIST](state, path) {
      const index = state.listFiles.findIndex(file => file.p === path);
      if (index >= 0) state.listFiles.splice(index, 1);
    },
    [RENAME_FILE_FILELIST](state, { path, newName }) {
      const index = getIndex(state.listFiles, path);
      file = state.listFiles[index];
      file.p = path.join(path.dirname(path), newName);
      file.name = path.basename(file.p);
      file.ext = path.extname(file.p).slice(1);
    }
  },
  actions: {
    async loadFiles(context, dir) {
      context.commit(SET_FILESLIST_LASTSELECTED, null);
      context.commit(SET_FILESLIST_LOADING, true);
      await api
        .getFilesList(dir)
        .then(files => {
          context.commit(SET_FILESLIST, files);
          context.commit(SET_FILESLIST_LOADING, false);
        })
        .catch(err => {
          errorToast(err, "File list failed to load.");
        });
    },

    async uploadFiles(context, { path, file, onProgress }) {
      await api
        .upload(path, file, onProgress)
        .then((event) => {
          //console.log(event);
          //context.dispatch("loadViewState");
        })
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to upload ${file.name} to ${path}.`
          };
        });
    },

    async moveFile(context, { target, file }) {
      const newFile = copyFileData(file, target);
      await api
        .moveFile(file.p, newFile.p)
        .then(() => {
          context.commit(REMOVE_FILE_FILELIST, file.p);
          if (isInFolder(newFile.p, context.getters.getCurrentDirectory))
            context.commit(ADD_FILE_FILELIST, newFile);
        })
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to move ${file.name} to ${target}.`
          };
        });
    },
    async copyFile(context, { target, file }) {
      const newFile = copyFileData(file, target);

      await api
        .copyFile(file.p, newFile.p)
        .then(() => {
          if (isInFolder(newFile.p, context.getters.getCurrentDirectory))
            context.commit(ADD_FILE_FILELIST, newFile);
        })
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to copy ${file.name} to ${target}.`
          };
        });
    },
    async deleteFile(context, file) {
      await api
        .deleteFile(file.p)
        .then(() => context.commit(REMOVE_FILE_FILELIST, file.p))
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to delete ${file.name}.`
          };
        });
    },
    async renameFile(context, { file, newName }) {
      if (file.name === newName) return;
      await api
        .renameFile(file.p, newName)
        .then(() => {
          context.commit(RENAME_FILE_FILELIST, { path: file.p, newName });
        })
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to rename ${file.name} to ${newName}.`
          };
        });
    }
  }
};
