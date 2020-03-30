import {
  ADD_JOB,
  SET_STATUS_JOB,
  INCREMENT_JOB_PROGRESS,
  SET_UPLOAD_PROGRESS
} from "../mutation-types";
import { errorToast } from "../../utils";

export default {
  state: {
    jobs: [],
    index: 0
  },
  mutations: {
    [ADD_JOB](state, job) {
      job.index = state.index;
      state.index++;
      state.jobs.push(job);
    },
    [SET_STATUS_JOB](state, { index, status }) {
      state.jobs[index].status = status;
    },
    [INCREMENT_JOB_PROGRESS](state, index) {
      state.jobs[index].n++;
    },
    [SET_UPLOAD_PROGRESS](state, { index, name, progress, size }) {
      const file = state.jobs[index].files.find(file => file.name === name);
      file.progress = progress;
      file.size = size;
    }
  },
  getters: {
    getJobs: state => state.jobs,
    isProcessing: state => state.jobs.findIndex(job => job.n < job.nMax) >= 0
  },
  actions: {
    processJob(context, { action, message, payloadList, onFinish = null }) {
      onFinish = onFinish === null ? () => {} : onFinish;
      const nMax = payloadList.length;
      if (nMax > 0) {
        const job = {
          type: "GENERAL",
          message: message,
          n: 0,
          nMax: nMax,
          status: "waiting",
          errors: [],
          onFinish: onFinish,
          process: async function(context, action, payloadList) {
            context.commit(SET_STATUS_JOB, {
              index: this.index,
              status: "processing"
            });
            let status = "success";
            for (let i = 0; i < payloadList.length; i++) {
              await context.dispatch(action, payloadList[i]).catch(err => {
                status = "error";
                this.errors.push(err.msg);
                errorToast(err);
              });
              context.commit(INCREMENT_JOB_PROGRESS, this.index);
            }
            context.commit(SET_STATUS_JOB, {
              index: this.index,
              status: status
            });
            this.onFinish(this);
          }
        };
        context.commit(ADD_JOB, job);
        job.process(context, action, payloadList);
      } else {
        throw new Error("payload list is empty");
      }
    },
    processUpload(context, { message, files, onFinish = null }) {
      onFinish = onFinish === null ? () => {} : onFinish;
      const nMax = files.length;
      if (nMax > 0) {
        const job = {
          type: "UPLOAD",
          message: message,
          n: 0,
          nMax: nMax,
          status: "waiting",
          onFinish: onFinish,
          files: files.map(file => {
            console.log(file);
            return {
              name: file.file.name,
              size: file.file.size,
              progress: 0,
              err: null
            };
          }),
          process: async function(context, payloadList) {
            context.commit(SET_STATUS_JOB, {
              index: this.index,
              status: "processing"
            });
            let status = "success";
            for (let i = 0; i < payloadList.length; i++) {
              await context
                .dispatch("uploadFiles", {
                  file: payloadList[i].file,
                  path: payloadList[i].path,
                  onProgress: event => {
                    context.commit(SET_UPLOAD_PROGRESS, {
                      index: this.index,
                      name: payloadList[i].file.name,
                      progress: event.loaded,
                      size: event.total
                    });
                  }
                })
                .catch(err => {
                  status = "error";
                  this.files[i].err = err.msg;
                  context.commit(SET_UPLOAD_PROGRESS, {
                    index: this.index,
                    name: payloadList[i].file.name,
                    progress: 0
                  });
                  errorToast(err);
                });
              context.commit(INCREMENT_JOB_PROGRESS, this.index);
            }
            context.commit(SET_STATUS_JOB, {
              index: this.index,
              status: status
            });
            this.onFinish(this);
          }
        };
        context.commit(ADD_JOB, job);
        job.process(context, files);
      }
    }
  }
};
