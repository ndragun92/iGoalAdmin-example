<template>
  <div class="text-center">
    <v-dialog v-model="_visible" width="500">
      <v-card>
        <v-card-title> Please enter reason for rejecting </v-card-title>

        <v-text-field class="ma-5" outlined flat v-model="_rejectReason" />

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" text @click="_visible = false"> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "RejectReasonDialog",

  props: ["visible", "rejectReason"],

  computed: {
    _visible: {
      get: function () {
        return this.visible;
      },
      set: function (value) {
        this.$emit("update:visible", value);
      },
    },
    _rejectReason: {
      get: function () {
        return this.rejectReason;
      },
      set: function (value) {
        this.$emit("update:rejectReason", value);
      },
    },
  },
  methods: {
    save() {
      this.$emit("save");
    },
  },
};
</script>

<style></style>
