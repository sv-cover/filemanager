<template>
  <section class="topmenu has-background-grey-dark">
    <b-field grouped>
      <b-field>
        <b-dropdown aria-role="list">
            <button class="button" slot="trigger" slot-scope="{ active }">
                <span>Files</span>
                <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </button>
            <b-dropdown-item aria-role="listitem"><b-icon icon="monitor"/> Preview</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="download"/> Download</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="folder-plus"/> New Folder</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="content-cut"/> Cut</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="content-copy"/> Copy</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="content-paste"/> Paste</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="delete"/> Delete</b-dropdown-item>
            <b-dropdown-item aria-role="listitem"><b-icon icon="pencil"/> Rename</b-dropdown-item>
        </b-dropdown>
      </b-field>

      <Breadcrumb :data.sync="newCurrentFolder" />

      <b-field grouped position="is-right" expanded>
        <b-field>
          <b-button icon-left="magnify"></b-button>
        </b-field>

        <b-field>
          <b-dropdown position="is-bottom-left" aria-role="list">
              <button class="button" slot="trigger" slot-scope="{ active }">
                  <b-icon icon="sort-ascending"></b-icon>
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
              </button>
              <b-dropdown-item aria-role="listitem"><b-icon icon="sort-ascending"/> A-Z</b-dropdown-item>
              <b-dropdown-item aria-role="listitem"><b-icon icon="sort-descending"/> Z-A</b-dropdown-item>
          </b-dropdown>
        </b-field>

        <b-field>
          <b-dropdown position="is-bottom-left" aria-role="list">
              <button size="is-small" class="button" slot="trigger" slot-scope="{ active }">
                  <b-icon icon="format-list-bulleted"></b-icon>
                  <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
              </button>
              <b-dropdown-item aria-role="listitem"><b-icon icon="format-list-bulleted"/> Details</b-dropdown-item>
              <b-dropdown-item aria-role="listitem"><b-icon icon="file-image"/> Thumbnails</b-dropdown-item>
          </b-dropdown>
        </b-field>
        </b-field>
      </b-field>
      
    </b-field>
  </section>
</template>

<script>
import FileMenu from './FileMenu.vue';
import Breadcrumb from './Breadcrumb.vue';

export default {
  name: 'TopMenu',
  components: {
    FileMenu,
    Breadcrumb
  },
  props: {
    currentFolder: {
      type: String,
      default: () => ''
    },
    selectedFiles: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    newCurrentFolder: {
      get: vm => vm.currentFolder,
      set: function(path) {
        this.$emit('update:currentFolder', path);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box:not(:last-child).topmenu,
.topmenu {
  padding: 0.2rem;
  margin-bottom: 0;
}
</style>
