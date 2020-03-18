<template>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul v-if="!isEmpty">
      <li v-for="(crumb, index) in breadCrumb" :key="index" :class="isLastCrumb(index) ? 'is-active' : ''">
        <a :aria-current="isLastCrumb(index) ? 'page' : ''" @click="clickCrumb(index)">
          {{crumb}}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import path from 'path';

export default {
  name: 'Breadcrumb',
  props: {
    data: String
  },
  computed: {
    isEmpty: vm => vm.data === null,
    breadCrumb: vm => vm.data.split('/')
  },
  methods: {
    isLastCrumb: function(index) {
      return index == (this.breadCrumb.length - 1);
    },
    clickCrumb: function(index) {
      this.$emit('update:data', this.breadCrumb.slice(0, index+1).join('/'));
    }
  }
};
</script>

<style scoped lang="scss">
  .breadcrumb li.is-active a {
    color: white;
  }
  .breadcrumb:not(:last-child) {
    margin-bottom: 0.5rem;
  }
</style>
