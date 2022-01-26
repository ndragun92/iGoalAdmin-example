<template>
  <v-app
    id="materialpro"
    :class="`${
      !$vuetify.breakpoint.smAndDown ? 'full-sidebar' : 'mini-sidebar'
    }`"
  >
    <router-view />
    <notifications position="bottom left" />
    <OverlayLoading />
  </v-app>
</template>

<script>
import {
  getAllCategories,
  getAllBranches,
  getAllColors,
} from "./common/general-api";
import OverlayLoading from "./components/OverlayLoading.vue";

export default {
  name: "App",

  components: { OverlayLoading },

  async created() {
    await getAllCategories();
    await getAllBranches();
    await getAllColors();
  },
};
</script>
