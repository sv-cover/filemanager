<template>
  <aside class="menu">
    <p class="menu-label">
      Folders
    </p>
    <ul class="menu-list">
      <Folder v-for="(folder, index) in folders" :key="index" :folder="folder" :currentFolder="currentFolder" v-on:update:currentFolder="setCurrentFolder" />
    </ul>
  </aside>
</template>

<script>
import Folder from './folder'

export default {
  name: 'Folders',
  components: {
    Folder
  },
  props: {
    folders: Array,
    currentFolder: String
  },
  methods: {
    setCurrentFolder: function (event) {
      this.$emit('update:currentFolder', event)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
