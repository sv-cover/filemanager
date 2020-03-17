<template>
  <div>
    <b-table :data="data" striped narrowed hoverable :mobile-cards="false">
      <template slot-scope="props">
        <b-table-column field="name" label="Name">
          {{ convertPathToName(props.row.p) }}
        </b-table-column>

        <b-table-column field="s" label="Size" width="100px">
          {{ formatFileSize(props.row.s) }}
        </b-table-column>

        <b-table-column field="t" label="Last Modified" width="200px" centered>
            {{ formatFileDate(props.row.t) }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
import { basename } from "path";

export default {
  name: "FileDetails",
  props: {
    data: Array
  },
  methods: {
    convertPathToName: function(path) {
      return basename(path);
    },
    formatFileDate: function(date) {
      return new Date(date * 1000).toLocaleString();
    },
    formatFileSize: function(sizeInBytes) {
      const byteUnits = ['B', 'kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = 0;
      for (i = 0; i < byteUnits.length; i++) {
        if (sizeInBytes < 1024) break;
        sizeInBytes = sizeInBytes / 1024;
      }
      return sizeInBytes.toFixed(2) + ' ' + byteUnits[i];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
