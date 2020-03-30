import Vue from "vue";
import Vuex from "vuex";
import { errorToast } from "../utils";
import ui from "./modules/ui";
import dir from "./modules/directory";
import files from "./modules/files";
import sorting from "./modules/sorting";
import selection from "./modules/selection";
import clipboard from "./modules/clipboard";
import jobs from "./modules/jobs";

Vue.use(Vuex);

function seperateFilesAndFolders(items, dirAction, fileAction) {
  return {
    files: items.filter(item => item.type === "FILE"),
    dirs: items.filter(item => item.type === "DIRECTORY")
  };
}

function typeName(type) {
  switch (type) {
    case "FILE":
      return "file";
    case "DIRECTORY":
      return "folder";
    default:
      return "unkown";
  }
}

function createMessage(action, items, target = null) {
  const type = items[0].type;
  target = target !== null ? `to "${target}"` : "";
  if (items.length === 1)
    return `${action} ${typeName(type)} "${items[0].name}" ${target}`;
  else return `${action} ${items.length} ${typeName(type)}s ${target}`;
}

export default new Vuex.Store({
  actions: {
    init(context) {
      context
        .dispatch("loadConfig")
        .then(() => {
          context.dispatch("loadDirList");
        })
        .catch(errorToast);
    },
    upload(context, { path, files }) {
      const msg = `uploading ${files.length} files to ${path}`;

      context.dispatch("processUpload", {
        message: msg,
        files: files.map(file => {
          return { path: path, file: file }
        }),
        onFinish: () => {
          if (context.getters.getCurrentDirectory === path)
            context.dispatch("loadFiles", path);
          context.dispatch("loadDirList");
        }
      });
    },
    newDir(context, { target, name }) {
      const items = [{ path: target, name: name, type: "DIRECTORY" }];
      context.dispatch("processJob", {
        action: "createDir",
        message: createMessage("create", items),
        payloadList: items,
        onFinish: () => context.dispatch("loadDirList")
      });
    },
    move(context, { items, target }) {
      const { files, dirs } = seperateFilesAndFolders(items);
      if (dirs.length > 0)
        context.dispatch("processJob", {
          action: "moveDir",
          message: createMessage("move", dirs, target),
          payloadList: dirs.map(dir => {
            return { target: target, directory: dir };
          }),
          onFinish: () => context.dispatch("loadDirList")
        });
      if (files.length > 0)
        context.dispatch("processJob", {
          action: "moveFile",
          message: createMessage("move", files, target),
          payloadList: files.map(file => {
            return { target: target, file: file };
          }),
          onFinish: () => context.dispatch("loadDirList")
        });
    },
    copy(context, { items, target }) {
      const { files, dirs } = seperateFilesAndFolders(items);
      if (dirs.length > 0)
        context.dispatch("processJob", {
          action: "copyDir",
          message: createMessage("copy", dirs, target),
          payloadList: dirs.map(dir => {
            return { target: target, directory: dir };
          }),
          onFinish: () => context.dispatch("loadDirList")
        });
      if (files.length > 0)
        context.dispatch("processJob", {
          action: "copyFile",
          message: createMessage("copy", files, target),
          payloadList: files.map(file => {
            return { target: target, file: file };
          }),
          onFinish: () => context.dispatch("loadDirList")
        });
    },
    delete(context, items) {
      const { files, dirs } = seperateFilesAndFolders(items);
      if (dirs.length > 0)
        context.dispatch("processJob", {
          action: "deleteDir",
          message: createMessage("delete", dirs),
          payloadList: dirs,
          onFinish: () => context.dispatch("loadDirList")
        });
      if (files.length > 0)
        context.dispatch("processJob", {
          action: "deleteFile",
          message: createMessage("delete", files),
          payloadList: files,
          onFinish: () => context.dispatch("loadDirList")
        });
    },
    rename(context, { item, newName }) {
      const msg = createMessage("renaming", [item], newName);
      if (item.type === "FILE") {
        context.dispatch("processJob", {
          action: "renameFile",
          message: msg,
          payloadList: [{ file: item, newName: newName }]
        });
      } else if (item.type === "DIRECTORY") {
        context.dispatch("processJob", {
          action: "renameDir",
          message: msg,
          payloadList: [{ dir: item, newName: newName }]
        });
      }
    }
  },
  modules: {
    ui: ui,
    dir: dir,
    files: files,
    sorting,
    selection,
    clipboard,
    jobs
  }
});
