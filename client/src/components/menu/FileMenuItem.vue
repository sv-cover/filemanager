<template>
      <li>
        <a @click="click()" :class="classDisabled(disabled)">
          <b-icon :icon="icon" /><span><slot></slot></span>
        </a>
      </li>
</template>

<script>
export default {
  name:"FileMenuItem",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    classDisabled: function(b) {
      return b ? "has-text-grey-light" : "";
    },
    click: function() {
      if (!this.disabled) this.$emit('click');
    }
  }
}
</script>

<style>

</style>