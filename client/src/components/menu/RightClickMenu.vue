<template>
  <div v-show="visible" @click="exit" @contextmenu.prevent="exit" class="full-screen">
    <div ref="right"  class="box right-click-menu">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightClickMenu",
  props: {
    visible: Boolean,
    position: {
      type: Object,
      default: () => {
        return {
          top: 0,
          left: 0
        };
      }
    }
  },
  watch: {
    position: function(position) {
      this.$refs.right.style.top = position.top + 'px';
      this.$refs.right.style.left = position.left + 'px';
    }
  },
  methods: {
    exit: function() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style>
.full-screen {
  width: 100%;
  height: 100%;
  position: fixed; /* Stay in place */
  z-index: 2; /* Sit on top */
  left: 0;
  top: 0;
}
.box.right-click-menu {
  padding: 0.5rem 0.25rem;
  width: 200px;
  position: relative; /* Stay in place */
  z-index: 1; /* Sit on top */
}
</style>
