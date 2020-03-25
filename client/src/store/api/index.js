import store from "../index";
import { fetchData } from "../../utils";

export default {
  getConfig() {
    return fetchData("conf.json", "GET");
  },

  getDirList() {
    return fetchData(store.state.ui.config.DIRLIST);
  },
  createDir(path, name) {
    return fetchData(store.state.ui.config.CREATEDIR, "POST", {
      d: path,
      n: name
    });
  },
  moveDir(path, newPath) {
    return fetchData(store.state.ui.config.MOVEDIR, "POST", {
      d: path,
      n: newPath
    });
  },
  copyDir(path, copyPath) {
    return fetchData(store.state.ui.config.COPYDIR, "POST", {
      d: path,
      n: copyPath
    });
  },
  deleteDir(path) {
    return fetchData(store.state.ui.config.DELETEDIR, "POST", { d: path });
  },
  renameDir(path, newName) {
    return fetchData(store.state.ui.config.RENAMEDIR, "POST", {
      d: path,
      n: newName
    });
  },

  uploadFiles(path, files) {
    const form = new FormData();
    form.set("action", "upload");
    form.set("method", "ajax");
    form.set("d", path);
    for (const index in files) {
      form.append("files[]", files[index], files[index].name);
    }
    return fetchData(store.state.ui.config.UPLOAD, "POST", form, true);
  },
  downloadFile(path) {
    return fetchData(store.state.ui.config.DOWNLOAD, "POST", { f: path });
  },
  downloadDir(path) {
    return fetchData(store.state.ui.config.DOWNLOADDIR, "POST", { d: path });
  },

  getFilesList(path) {
    return fetchData(store.state.ui.config.FILESLIST, "POST", { d: path });
  },
  moveFile(path, newPath) {
    return fetchData(store.state.ui.config.MOVEFILE, "POST", {
      f: path,
      n: newPath
    });
  },
  copyFile(path, copyPath) {
    return fetchData(store.state.ui.config.COPYFILE, "POST", {
      f: path,
      n: copyPath
    });
  },
  renameFile(path, newName) {
    return fetchData(store.state.ui.config.RENAMEFILE, "POST", {
      f: path,
      n: newName
    });
  },
  deleteFile(path) {
    return fetchData(store.state.ui.config.DELETEFILE, "POST", { f: path });
  }
};
