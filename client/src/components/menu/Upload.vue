<template>
        <b-field class="file">
          <b-upload v-model="files" @input="onUpload" :drag-drop="dragDrop" multiple>
                <section v-if="dragDrop" class="section">
                    <div class="content has-text-centered">
                        <p>
                            <b-icon
                                icon="upload"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Drop your files here</p>
                    </div>
                </section>
            <a v-else>
              <b-icon icon="upload"></b-icon>
              <span>Click to upload</span>
            </a>
          </b-upload>
        </b-field>
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
    currentFolder: String,
    dragDrop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onUpload: function(value) {
      this.$emit('upload', value);
      this.$store.dispatch('uploadFiles', {path: this.currentFolder, files: value}).then(() => {
        this.files = [];
      });
    }
  }
}
</script>

<style>

</style>