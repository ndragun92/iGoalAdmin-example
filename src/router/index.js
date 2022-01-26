import Vue from "vue";
import VueRouter from "vue-router";

import MainLayout from "@/layouts/MainLayout.vue";

Vue.use(VueRouter);

const routes = new VueRouter({
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
      // meta: { requireAuth: false },
    },
    {
      path: "",
      component: MainLayout,
      meta: { requireAuth: true },
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/Home/Home.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "products",
          name: "Products",
          component: () => import("@/views/Products/Products.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "users",
          name: "Users",
          component: () => import("@/views/Users/Users.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "orders",
          name: "Orders",
          component: () => import("@/views/Orders/Orders.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "requests",
          name: "Requests",
          component: () => import("@/views/Requests/Requests.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "pendingShipments",
          name: "Pending Shipments",
          component: () => import("@/views/Shipping/Pending/Pending.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "pendingShipmentsNew",
          name: "Pending Shipments New",
          component: () => import("@/views/Shipping/PendingNew/PendingNew.vue"),
          meta: { requireAuth: true },
        },
        {
          path: "shipmentHistory",
          name: "Shipment History",
          component: () => import("@/views/Shipping/History/History.vue"),
          meta: { requireAuth: true },
        },
      ],
    },
  ],
  mode: "hash",
});

routes.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!localStorage.getItem("accessToken")) {
      next({
        name: "login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default routes;
