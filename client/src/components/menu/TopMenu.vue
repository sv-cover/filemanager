<template>
  <section class="topmenu has-background-grey-dark">
    <b-field grouped>
      <b-field>
        <b-dropdown aria-role="menu">
            <button class="button" slot="trigger" slot-scope="{ active }">
                <span>Files</span>
                <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
            </button>
            <b-dropdown-item 
              aria-role="menuitem"
              :focusable="false"
            >
              <FileMenu/>
            </b-dropdown-item>
            
        </b-dropdown>
      </b-field>

      <b-field grouped position="is-centered" expanded>
        <b-field expanded>
          <Breadcrumb v-if="isBreadcrumb" v-model="currentDirectory" />
          <b-input v-else v-model="searchBar" />
        </b-field>
        <b-field position="is-right">
          <b-checkbox-button :native-value="false" v-model="isBreadcrumb">
            <b-icon icon="magnify" />
          </b-checkbox-button>
        </b-field>
      </b-field>

      <b-field grouped position="is-right">
        <b-field>
          <FilemanSelect :options="sortOptions" v-model="sortOrder" position="is-bottom-left" />
        </b-field>
        <b-field>
          <FilemanSelect :options="viewOptions" v-model="view" position="is-bottom-left" />
        </b-field>
      </b-field>
      
    </b-field>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import FileMenu from './FileMenu.vue';
import Breadcrumb from './Breadcrumb.vue';
import FilemanSelect from './FilemanSelect'

export default {
  name: 'TopMenu',
  components: {
    FileMenu,
    Breadcrumb,
    FilemanSelect
  },
  data() {
    return {
      breadcrumb: true
    }
  },
  computed: {
    ...mapState({
      viewOptions: state => state.ui.viewOptions
    }),
    ...mapGetters({
      sortOptions: 'getSortOptionsList'
    }),
    view: {
      get: vm => vm.$store.state.ui.view,
      set: function(view) {this.$store.dispatch('setView', view);}
    },
    sortOrder: {
      get: vm => vm.$store.state.files.sortOrder,
      set: function(order) {this.$store.dispatch('setSortOrder', order);}
    },
    searchBar: {
      get: vm => vm.$store.state.files.searching,
      set: function(input) {this.$store.dispatch('setSearch', input);}
    },
    currentDirectory: {
      get: vm => vm.$store.state.dir.currentDirectory,
      set: function(dir) {this.$store.dispatch('setCurrentDir', dir)}
    },
    isBreadcrumb: {
      get: vm => vm.breadcrumb,
      set: function(value) {
        this.$store.dispatch('setSearch', '');
        this.breadcrumb = value;
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
