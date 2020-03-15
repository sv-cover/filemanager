<template>
  <b-navbar>
    <Menu />
    <template slot="start">
      <b-navbar-dropdown label="Files">
      </b-navbar-dropdown>

      <b-navbar-item tag="div">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="#">Bulma</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Components</a></li>
            <li class="is-active">
              <a href="#" aria-current="page">Breadcrumb</a>
            </li>
          </ul>
        </nav>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <b-field>
          <b-input
            placeholder="Search..."
            type="search"
            icon="magnify"
            icon-clickable
          >
          </b-input>
        </b-field>
      </b-navbar-item>

      <b-navbar-item tag="div">
        <b-field>
          <b-select placeholder="Select a name">
            <option value="name-asc"> ↑ A-Z</option>
            <option value="name-desc"> ↓ Z-A</option>
          </b-select>
        </b-field>
      </b-navbar-item>

      <b-navbar-item tag="div">
        <b-field>
          <b-select placeholder="Select a view">
            <option value="details"> Details</option>
            <option value="thumbnails"> Thumbnails</option>
          </b-select>
        </b-field>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import FileMenu from "./FileMenu.vue";

export default {
  name: "Menu",
  components: {
    FileMenu
  },
  data() {
    return {
      isActive: true,
      search: [
        "Angular",
        "Angular 2",
        "Aurelia",
        "Backbone",
        "Ember",
        "jQuery",
        "Meteor",
        "Node.js",
        "Polymer",
        "React",
        "RxJS",
        "Vue.js"
      ],
      name: ""
    };
  },
  computed: {
    filteredDataArray() {
      return this.data.search.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.name.toLowerCase()) >= 0
        );
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
