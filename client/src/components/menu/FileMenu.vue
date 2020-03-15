<template>
  <b-menu>
    <b-menu-list>
      <b-menu-item
        icon="monitor"
        label="Preview"
      ></b-menu-item>
      <b-menu-item
        icon="download"
        label="Download"
      ></b-menu-item>
      <b-menu-item
        icon="folder-plus"
        label="New Folder"
      ></b-menu-item>
      <b-menu-item
        icon="content-cut"
        label="Cut"
      ></b-menu-item>
      <b-menu-item
        icon="content-copy"
        label="Copy"
      ></b-menu-item>
      <b-menu-item
        icon="content-paste"
        label="Paste"
      ></b-menu-item>
      <b-menu-item
        icon="pencil"
        label="Rename"
      ></b-menu-item>
      <b-menu-item
        icon="delete"
        label="Delete"
      ></b-menu-item>
    </b-menu-list>
  </b-menu>
</template>

<script>
export default {
  data() {
    return {
      isActive: true
    };
  }
};
</script>
