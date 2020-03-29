<template>
  <b-field v-if="jobs.length > 0">
    <b-dropdown position="is-bottom-left" aria-role="menu" trap-focus>
      <button class="button" slot="trigger" slot-scope="{ active }">
        <span>Jobs</span>
        <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
      </button>
      <div class="jobMenu">
        <b-dropdown-item
          v-for="(job, index) in jobs"
          :key="index"
          :focusable="false"
          aria-role="listitem"
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
                    :value="progress[index]"
                    show-value
                    >{{ job.n }}/{{ job.nMax }}</b-progress
                  >
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
      jobs: "getJobs"
    }),
    progress: vm => vm.jobs.map(job => job.n * (100 / job.nMax)),
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
}
.job {
  padding: 0.25rem;
}
</style>
