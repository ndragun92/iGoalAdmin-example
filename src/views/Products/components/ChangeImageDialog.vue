<template>
  <v-row justify="center">
    <v-dialog v-model="_imageDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Change Product Image</span>
        </v-card-title>
        <!--  -->
        <div style="width: 350px; margin: 0 auto">
          <vue-image-chooser
            name="image-picker"
            @change="uploadFile"
            :progress="progress"
            :error="error"
          />
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="_imageDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ChangeImageDialog",
  props: ["imageDialog", "image"],
  computed: {
    _imageDialog: {
      get: function () {
        return this.imageDialog;
      },
      set: function (value) {
        this.$emit("update:imageDialog", value);
      },
    },
    _image: {
      get: function () {
        return this.image;
      },
      set: function (value) {
        this.$emit("update:image", value);
      },
    },
  },
  data: () => ({
    progress: null,
    error: null,
  }),
  methods: {
    uploadFile(file) {
      this._image = file;
    },
    save() {
      this.$emit("save");
    },
  },
};
</script>

<style></style>
