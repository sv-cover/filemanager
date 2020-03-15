<template>
  <li>
    <a :class="isActive ? 'is-active' : ''" v-on:click="clickFolder">
      <b-icon size="is-small" :icon="isExpanded ? 'folder-open' : 'folder'"></b-icon>
      {{folder.p + ' (' + folder.f + ')'}}
    </a>
    <ul v-if="isExpanded">
      <Folder v-for="(child, index) in folder.c" :key="index" :folder="child" :currentFolder="currentFolder" v-on:update:currentFolder="setCurrentFolder" />
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'Folder',
    data: function () {
      return {
        expanded: false
      }
    },
    props: {
      folder: Object,
      currentFolder: String
    },
    computed: {
      isActive: function () {
        return this.currentFolder === this.folder.p
      },
      isExpanded: function () {
        return this.folder.d > 0 & this.expanded
      }
    },
    methods: {
      toggleExpanded: function (event) {
        this.expanded = !this.expanded
      },
      clickFolder: function (event) {
        if (event.target.tagName === 'I') {
          this.toggleExpanded()
        } else {
          if (!this.expanded) this.expanded = true
          this.$emit('update:currentFolder', this.folder)
        }
      },
      setCurrentFolder: function (event) {
        this.$emit('update:currentFolder', event)
      }
    }
  }
</script>

<style lang="scss" scoped>
li>a {
  display: inline-block;
}
</style>