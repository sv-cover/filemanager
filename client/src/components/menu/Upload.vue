<template>
      <li>
        <b-field class="file">
          <b-upload v-model="files" @input="onUpload" multiple>
            <a>
              <b-icon icon="upload"></b-icon>
              <span>Click to upload</span>
            </a>
          </b-upload>
        </b-field>
      </li>
</template>

<script>
export default {
  name: 'Upload',
  data() {
    return {
      files: []
    };
  },
  props: {
    currentFolder: String 
  },
  methods: {
    onUpload: function(value) {
      console.log(value);
      this.$store.dispatch('uploadFiles', {path: this.currentFolder, files: value}).then(() => {
        this.files = [];
      });
    }
  }
}
</script>

<style>

</style>