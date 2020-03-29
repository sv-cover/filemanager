<template>
  <div v-if="isDraggingUploads" class="files" @dragleave="onDragLeave">
    <Upload :currentFolder="'uploads'" @upload="onUpload" class="dragUploads" dragDrop />
  </div>
  <div v-else class="files" @dragenter.prevent="onDragEnter" @dragleave="onDragLeave">
    <FilesDetails
      v-if="isVisible('VIEW_DETAILS')"
      :data="filesList"
      :isLoading="isLoadingFilesList"
      :selected="getBooleanSelectedFiles"
      @click:file="clickFile"
      @contextmenu="rightClick"
    />
    <FilesThumbs v-if="isVisible('VIEW_THUMBS')" />
    <RightClickMenu :visible.sync="rightClickMenu" :position="position">
      <FileMenu hasPreview />
    </RightClickMenu>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import { errorToast } from "../../utils";
import FilesDetails from "./FilesDetails";
import FilesThumbs from "./FilesThumbs";
import RightClickMenu from "../menu/RightClickMenu";
import FileMenu from "../menu/FileMenu";
import Upload from "../menu/Upload";

export default {
  name: "Files",
  components: {
    FilesDetails,
    RightClickMenu,
    FileMenu,
    FilesThumbs,
    Upload
  },
  data() {
    return {
      rightClickMenu: false,
      position: {
        top: 0,
        left: 0
      },
      counterDragUploads: 0
    };
  },
  computed: {
    ...mapState({
      isLoadingFilesList: state => state.files.isLoading,
      view: state => state.ui.view
    }),
    ...mapGetters({
      getBooleanSelectedFiles: "getBooleanSelectedFiles",
      filesList: "getSortedFilesList"
    }),
    selectedFiles: {
      get: function() {
        return this.$store.getters.getListSelecedItems;
      },
      set: function(selected) {
        this.$store.dispatch("setSelectedFiles", selected);
      }
    },
    lastSelected: {
      get: function() {
        return this.$store.state.selection.lastSelected;
      },
      set: function(file) {
        this.$store.dispatch("setLastSelected", file);
      }
    },
    isDraggingUploads: vm => vm.counterDragUploads > 0
  },
  methods: {
    isVisible: function(view) {
      return view === this.view;
    },
    clickFile: function(file, modKey) {
      const isSelected =
        this.selectedFiles.findIndex(f => f.index == file.index) >= 0;
      if (modKey.ctrl && isSelected) {
        this.$store.dispatch("removeSelectedFile", file);
      } else {
        let selected = [file];
        if (modKey.shift && this.lastSelected) {
          const indexSelected = this.filesList.findIndex(
            f => f.index == file.index
          );
          const indexLastSelected = this.filesList.findIndex(
            f => f.index == this.lastSelected.index
          );
          const [startIndex, endIndex] =
            indexSelected > indexLastSelected
              ? [indexLastSelected, indexSelected]
              : [indexSelected, indexLastSelected];
          for (let i = startIndex; i <= endIndex; i++) {
            selected.push(this.filesList[i]);
          }
        }
        if (modKey.ctrl) {
          this.$store.dispatch("addSelectedFiles", selected);
        } else {
          this.selectedFiles = selected;
        }
        this.lastSelected = file;
      }
    },
    rightClick: function(event, file) {
      if (file === null) {
        this.$store.dispatch("setSelectedFiles", []);
      } else if (!this.$store.getters.isInSelected(file)) {
        this.$store.dispatch("setSelectedFiles", [file]);
      }
      this.position = {
        top: event.y,
        left: event.x
      };
      this.rightClickMenu = true;
    },
    onDragEnter: function(event) {
      console.log(event.dataTransfer)
      if (event.dataTransfer.types.includes("application/x-moz-file")) {
        this.counterDragUploads++;
      }
    },
    onDragLeave: function(event) {
      this.counterDragUploads--;
    },
    onUpload: function(event) {
      this.counterDragUploads = 0;
    }
  }
};
</script>

<style>
.files {
  height: 100%;
  width: 100%;
}
.dragUploads,
.dragUploads .upload.control,
.dragUploads .upload.control .upload-draggable {
  height: 100%;
  width: 100%;
}
.dragUploads .upload.control {
  width: 100%;
}
</style>
