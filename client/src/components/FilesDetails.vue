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
          :class="selected[file.index] ? 'is-selected' : ''"
        >
          <td>
            <span>
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
import { basename } from 'path';

import utils from '../utils';

export default {
  name: "FileDetails",
  props: {
    data: Array,
    isLoading: {
      type: Boolean,
      default: false
    },
    selected: Array
  },
  computed: {
    isEmpty: function() {
      return !this.data.length > 0 && !this.isLoading;
    }
  },
  methods: {
    formatFileDate: utils.formatFileDate,
    formatFileSize: utils.formatFileSize,
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
