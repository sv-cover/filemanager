<template>
  <b-field v-if="jobs.length > 0">
    <b-dropdown position="is-bottom-left" aria-role="menu" trap-focus>
      <button class="button" slot="trigger" slot-scope="{ active }">
        <b-icon :icon="isProcessing ? 'progress-clock' : 'progress-check'"></b-icon>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
      <div class="jobMenu">
        <b-dropdown-item
          v-for="(job, index) in jobs"
          :key="index"
          :focusable="false"
          aria-role="menu"
          paddingless
          custom
        >
          <div class="job">
            <div class="media">
              <div class="media-content">
                <small>
                  <center>{{ job.message }}</center>
                  <b-progress
                    v-if="job.nMax > 1"
                    :value="job.n"
                    :max="job.nMax"
                    show-value
                    >{{ job.n }}/{{ job.nMax }}
                  </b-progress>
                  <div
                    v-if="job.type === 'GENERAL' && job.errors.length > 0"
                    class="content"
                  >
                    <ul>
                      <li v-for="(err, key) in job.errors" :key="key">
                        <b-tag type="is-danger">{{ err }}</b-tag>
                      </li>
                    </ul>
                  </div>
                  <div 
                    v-if="job.type === 'UPLOAD'"
                    class="upload-table"
                  >
                    <table
                      class="table is-fullwidth is-narrow upload-table"
                    >
                      <tr v-for="(file, key) in job.files" :key="key">
                        <td>{{ file.name }}</td>
                        <td>
                          <b-progress
                            :value="file.progress"
                            :max="file.size"
                            format="percent"
                            show-value
                          >
                            <template v-if="file.err !== null">
                              {{ file.err }}
                            </template>
                          </b-progress>
                        </td>
                      </tr>
                    </table>
                  </div>
                </small>
              </div>
              <div class="media-right">
                <b-icon :icon="statusIcons[index]" />
              </div>
            </div>
          </div>
        </b-dropdown-item>
      </div>
    </b-dropdown>
  </b-field>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "JobList",
  computed: {
    ...mapGetters({
      jobs: "getJobs",
      isProcessing: "isProcessing"
    }),
    statusIcons: vm =>
      vm.jobs.map(job => {
        switch (job.status) {
          case "waiting":
          case "processing":
            return "clock-outline";
          case "success":
            return "check";
          case "error":
            return "alert-circle-outline";
          default:
            return "";
        }
      })
  }
};
</script>

<style scoped lang="scss">
.jobMenu {
  width: 300px;
  overflow-y: scroll;
  max-height: 21rem;
}
.job,
.menu-list li {
  padding: 0.25rem;
  overflow-y: scroll;
  max-height: 9rem;
}
.progress-wrapper:not(:last-child) {
  margin-bottom: 0;
}
</style>
