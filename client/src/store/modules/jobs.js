import { ADD_JOB, SET_STATUS_JOB, INCREMENT_JOB } from "../mutation-types";
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
    [INCREMENT_JOB](state, index) {
      state.jobs[index].n++;
    }
  },
  getters: {
    getJobs: state => state.jobs
  },
  actions: {
    processJob(context, { action, message, payloadList, onFinish = null }) {
      onFinish = onFinish === null ? () => {} : onFinish;
      const nMax = payloadList.length;
      if (nMax > 0) {
        const job = {
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
              context.commit(INCREMENT_JOB, this.index);
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
    }
  }
};
