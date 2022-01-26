<template>
  <v-menu
    v-model="_visible"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="_date"
        :label="label"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        clearable
      ></v-text-field>
    </template>
    <v-date-picker v-model="_date" @input="_visible = false"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Date",
    },
  },
  computed: {
    _visible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
    _date: {
      get() {
        return this.date;
      },
      set(value) {
        this.$emit("update:date", value);
      },
    },
  },
};
</script>

<style></style>
