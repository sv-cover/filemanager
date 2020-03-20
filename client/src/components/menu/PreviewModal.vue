<template>
<div class="card">
  <header class="card-header">
    <p class="card-header-title">
      {{fullPath}}
    </p>
  </header>
  <div class="card-image">
    <figure v-if="isImage" class="image">
      <img :src="file.p" alt="Placeholder image">
    </figure>
    <figure v-else class="image is-4by3">
      <iframe class="has-ratio" width="640" height="360" :src="file.p" frameborder="0" allowfullscreen></iframe>
  </figure>
  </div>
  <div class="card-content has-text-centered">
      {{fileSize}} <time datetime="2016-1-1">{{fileDate}}</time>
  </div>
</div>
</template>

<script>
import utils from '../../utils'

export default {
  name: "PreviewModal",
  props: {
    file: Object
  },
  computed: {
    fullPath: vm => window.location.host + '/' + vm.file.p,
    fileSize: vm => utils.formatFileSize(vm.file.s),
    fileDate: vm => utils.formatFileDate(vm.file.t),
    isImage: vm => utils.isImage(vm.file.ext)
  }
};
</script>

<style></style>
