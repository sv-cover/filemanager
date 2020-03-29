import path from "path";

import { errorToast } from "../../utils";
import api from "../api";
import {
  SET_DIRLIST,
  SET_CURRENT_DIR,
  SET_DIRLIST_LOADING
} from "../mutation-types";

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
    currentDirectory: "",
    listDirectories: [],
    isLoading: false
  },
  mutations: {
    [SET_DIRLIST](state, directories) {
      state.listDirectories = expandFolder(directories);
    },
    [SET_CURRENT_DIR](state, currentDir) {
      if (folderExists(currentDir, state.listDirectories))
        state.currentDirectory = currentDir;
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
    async loadDirList(context) {
      await api
        .getDirList()
        .then(dirList => {
          context.commit(SET_DIRLIST, dirList);
          if (!folderExists(context.state.currentDirectory, dirList)) {
            let currentDir = "";
            if (dirList.length > 0) currentDir = dirList[0].p;
            context.dispatch("setCurrentDir", currentDir);
          }
        })
        .catch(err => {
          throw { msg: "Directory tree failed to load.", err };
        });
    },
    setCurrentDir(context, dir) {
      if (context.state.currentDirectory !== dir) {
        context.commit(SET_CURRENT_DIR, dir);
        context.dispatch("setSelectedFiles", []);
        context.dispatch("setLastSelected", null);
        context.dispatch("loadFiles", dir);
      }
    },

    async createDir(context, { path, name }) {
      await api.createDir(path, name).catch(err => {
        throw {
          err: err,
          msg: `Failed to create ${name}.`
        };
      });
    },
    async moveDir(context, { directory, target }) {
      await api
        .moveDir(directory.p, path.join(target, directory.name))
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to move ${file.name} to ${target}.`
          };
        });
    },
    async copyDir(context, { directory, target }) {
      await api
        .copyDir(directory.p, path.join(target, directory.name))
        .catch(err => {
          throw {
            err: err,
            msg: `Failed to copy ${file.name} to ${target}.`
          };
        });
    },
    async deleteDir(context, directory) {
      await api.deleteDir(directory.p).catch(err => {
        throw {
          err: err,
          msg: `Failed to delete ${file.name}.`
        };
      });
    },
    async renameDir(context, { dir, newName }) {
      await api.renameDir(dir.p, newName).catch(err => {
        throw {
          err: err,
          msg: `Failed to rename ${file.name} to ${newName}.`
        };
      });
    }
  },
  modules: {}
};
