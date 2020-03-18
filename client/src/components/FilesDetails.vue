<template>
  <div>
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Last Modified</th>
        </tr>
      </thead>
      <tbody class="noselect">
        <tr
          v-for="(file, index) in data"
          :key="index"
          @click="clickFile($event, file, index)"
          :class="file.selected ? 'is-selected' : ''"
        >
          <td>
            <span draggable="true">
              <b-icon size="is-small" icon="file" />
              {{ file.name }}
            </span>
          </td>
          <td>{{ formatFileSize(file.s) }}</td>
          <td>{{ formatFileDate(file.t) }}</td>
        </tr>
      </tbody>
    </table>

    <section v-if="isLoading" class="section">
          <b-progress></b-progress>
    </section>

    <section v-if="isEmpty" class="section">
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
        </p>
        <p>Nothing here.</p>
      </div>
    </section>
  </div>
</template>

<script>
import { basename } from "path";

export default {
  name: "FileDetails",
  props: {
    data: Array,
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isEmpty: function() {
      return !this.data.length > 0 && !this.isLoading;
    }
  },
  methods: {
    formatFileDate: function(date) {
      return new Date(date * 1000).toLocaleString();
    },
    formatFileSize: function(sizeInBytes) {
      const byteUnits = [
        "B",
        "kB",
        " MB",
        " GB",
        " TB",
        "PB",
        "EB",
        "ZB",
        "YB"
      ];
      let i = 0;
      for (i = 0; i < byteUnits.length; i++) {
        if (sizeInBytes < 1024) break;
        sizeInBytes = sizeInBytes / 1024;
      }
      return sizeInBytes.toFixed(2) + " " + byteUnits[i];
    },
    clickFile: function(event, file, index) {
      this.$emit("click:file", file, {
        ctrl: event.ctrlKey,
        shift: event.shiftKey
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}
</style>
