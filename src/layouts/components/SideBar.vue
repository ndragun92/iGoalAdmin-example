<template>
  <v-navigation-drawer
    :value="sideBar_Drawer"
    mobile-breakpoint="960"
    clipped
    app
    id="main-sidebar"
  >
    <v-list dense nav>
      <!---USer Area -->
      <v-list-item two-line class="px-0">
        <v-list-item-avatar>
          <img
            src="https://www.monteirolobato.edu.br/public/assets/admin/images/avatars/avatar1_big.png"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Administrator</v-list-item-title>
          <v-list-item-subtitle class="caption"
            >Padaz-Intl</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <!---USer Area -->
      <!---Sidebar Items -->
      <template v-for="item in items">
        <!-- Single Menus -->

        <v-list-item
          v-if="!item.children"
          :key="item.title"
          :to="item.to"
          :active-class="`success white--text`"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Nested Menus -->

        <v-list-group
          v-if="item.children"
          :key="item.title"
          :prepend-icon="item.icon"
          append-icon="mdi-menu-down"
        >
          <v-list-item-content slot="activator">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            link
            :to="child.to"
            :active-class="`success white--text`"
          >
            <v-list-item-icon>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
      <!---Sidebar Items -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/",
      },
      {
        title: "Users",
        icon: "mdi-account-multiple",
        to: "/users",
      },

      {
        title: "Products",
        icon: "mdi-dropbox",
        to: "/products",
      },
      {
        title: "Orders",
        icon: "mdi-cart",
        to: "/orders",
      },
      {
        title: "Product Requests",
        icon: "mdi-comment-alert",
        to: "/requests",
      },
      {
        title: "Shipping",
        icon: "mdi-truck",
        children: [
          {
            title: "Pending For Shipping",
            icon: "mdi-account-multiple",
            to: "/pendingShipments",
          },
          {
            title: "Shipped History",
            icon: "mdi-account-multiple",
            to: "/shipmentHistory",
          },
        ],
      },
      {
        title: "General",
        icon: "mdi-format-list-bulleted",
        children: [
          {
            title: "Branches",
            icon: "mdi-source-branch",
            to: "/pendingShipments",
          },
          {
            title: "Banners",
            icon: "mdi-folder-image",
            to: "/shipmentHistory",
          },
          {
            title: "Colors",
            icon: "mdi-format-color-fill",
            to: "/shipmentHistory",
          },
          {
            title: "Price Conversion",
            icon: "mdi-bank",
            to: "/shipmentHistory",
          },
        ],
      },
    ],
  }),
  computed: mapGetters(["sideBar_Drawer"]),

  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val);
    },
  },

  methods: {},
};
</script>
<style lang="scss">
#main-sidebar {
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);
  .v-navigation-drawer__border {
    display: none;
  }
  .v-list {
    padding: 8px 15px;
  }
  .v-list-item {
    &__icon--text,
    &__icon:first-child {
      justify-content: center;
      text-align: center;
      width: 20px;
    }
  }
}
</style>
