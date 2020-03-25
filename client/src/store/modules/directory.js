import path from "path";

import { errorToast } from "../../utils";
import api from "../api";
import { SET_DIRLIST, SET_CURRENT_DIR, SET_DIRLIST_LOADING } from "../mutation-types";

function expandFolder(folders) {
  return folders.map(folder => {
    folder.type = "DIRECTORY";
    folder.name = path.basename(folder.p);
    folder.c = expandFolder(folder.c);
    return folder;
  });
}

function folderExists(folder, folderList) {
  if (folderList.length == 0) return false; 
  return folderList.some(f => {
    if (folder === f.p) return true;
    return folderExists(folder, f.c);
  });
}

export default {
  state: {
    currentDirectory: '',
    listDirectories: [],
    isLoading: false
  },
  mutations: {
    [SET_DIRLIST](state, directories) {
      state.listDirectories = expandFolder(directories);
      if (!folderExists(state.currentDirectory, directories)) {
        if (state.listDirectories.length > 0) state.currentDirectory = state.listDirectories[0].p;
        else state.currentDir = '';
      }
    },
    [SET_CURRENT_DIR](state, currentDir) {
      if (folderExists(currentDir, state.listDirectories)) state.currentDirectory = currentDir;
      else throw new Error(currentDir + " does not exist");
    },
    [SET_DIRLIST_LOADING](state, loading) {
      state.isLoading = loading;
    }
  },
  getters: {
    getCurrentDirectory: state => state.currentDirectory
  },
  actions: {
    loadDirList(context) {
      return new Promise((resolve, reject) => {
        api
          .getDirList()
          .then(dirList => {
            context.commit(SET_DIRLIST, dirList);
            resolve("success");
          })
          .catch(err => {
            errorToast(err, 'Directory tree failed to load.');
            reject(err);
          });
      });
    },
    setCurrentDir(context, dir) {
      context.commit(SET_CURRENT_DIR, dir);
      context.dispatch('setSelectedFiles', []);
      context.dispatch('setLastSelected', null);
      context.dispatch('loadFiles', dir);
    },

    createDir(context, {path, name}) {
      api.createDir(path, name).then(() => {
        context.dispatch('loadViewState');
      }).catch(err => errorToast(err, "Failed to create directory"));
    },
    async moveDirs(context, { directories, target }) {
      for (let i = 0; i < directories.length; i++) {
        await api.moveDir(directories[i].p, path.join(target, directories[i].name)).catch(err => errorToast(err, "Failed to move dir"));
      }
    },
    async copyDirs(context, { directories, target }) {
      for (let i = 0; i < directories.length; i++) {
        await api.copyDir(directories[i].p, path.join(target, directories[i].name)).catch(err => errorToast(err, "Failed to copy dir"));
      }
    },
    async deleteDirs(context, directories) {
      for (let i = 0; i < directories.length; i++) {
        await api.deleteDir(directories[i].p).catch(err => errorToast(err, "Failed to delete dir"));
      }
    },
    renameDir(context, {dir, newName}) {
      api.renameDir(dir.p, newName).then(() => {
        context.dispatch('loadDirList');
      }).catch(err => errorToast(err, "Failed to create directory"));
    },
  },
  modules: {
  }
}