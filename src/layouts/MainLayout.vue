<template>
  <v-app id="inspire">
    <Header />
    <SideBar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import SideBar from "./components/SideBar.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "MainLayout",
  components: { Header, SideBar, Footer },
};
</script>

<style></style>
