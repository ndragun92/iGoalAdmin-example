<template>
  <!-- Overlay set to 203 to show on top of other dialog boxes -->
  <v-overlay :value="loading" z-index="203">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "OverlayLoading",
  computed: mapGetters(["loading"]),
};
</script>
