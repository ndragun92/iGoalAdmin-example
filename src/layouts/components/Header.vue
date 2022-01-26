<template>
  <v-app-bar app clipped-left clipped-right color="primary" dark>
    <v-toolbar-title class="align-center d-flex">
      <!-- Logo Part -->
      <span class="logo-icon">
        <img src="../../assets/iGoal-60x60.png" height="60" width="60" />
      </span>
      <span class="logo-text ml-2"> iGoal </span>
    </v-toolbar-title>
    <v-app-bar-nav-icon class="d-block" @click="Sidebar_drawer" />
    <v-spacer />
    <!---right part -->
  </v-app-bar>
</template>
<script>
import { mapActions } from "vuex";

// Utilities
export default {
  name: "Header",
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    ...mapActions({
      Sidebar_drawer: "toggleSideBar",
    }),
  },
};
</script>
