<template>
  <b-dropdown
    v-model="selectedValue"
    :position="position"
    aria-role="list"
  >
    <button class="button" slot="trigger">
      <b-icon :icon="selectedOption.icon"></b-icon>
      <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
    </button>
    <b-dropdown-item
      aria-role="listitem"
      v-for="(o, i) in options"
      :key="i"
      :value="o.value"
    >
      <b-icon :icon="o.icon" /> {{ o.label }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "FilemanSelect",
  props: {
    options: Array,
    value: String,
    position: {
      type: String,
      default: "is-bottom-right"
    }
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
    selectedValue: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.$emit("input", value);
      }
    },
    selectedOption: function() {
      return this.options.find(o => o.value === this.value);
    }
  }
};
</script>

<style></style>
