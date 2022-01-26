import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: [],
    branches: [],
    colors: [],
    sideBar_Drawer: true,
    loading: false,
  },
  getters: {
    categories: (state) => {
      return state.categories;
    },
    branches: (state) => {
      return state.branches;
    },
    colors: (state) => {
      return state.colors;
    },
    sideBar_Drawer: (state) => {
      return state.sideBar_Drawer;
    },
    loading: (state) => {
      return state.loading;
    },
  },
  mutations: {
    UPDATE_CATEGORIES(state, { data }) {
      state.categories = data;
    },
    UPDATE_BRANCHES(state, { data }) {
      state.branches = data;
    },
    UPDATE_COLORS(state, { data }) {
      state.colors = data;
    },
    UPDATE_SIDEBAR_DRAWER(state) {
      state.sideBar_Drawer = !state.sideBar_Drawer;
    },
    SET_LOADING(state, data) {
      state.loading = data;
    },
  },
  actions: {
    addToCategories(context, payload) {
      context.commit("UPDATE_CATEGORIES", payload);
    },
    addToBranches(context, payload) {
      context.commit("UPDATE_BRANCHES", payload);
    },
    addToColors(context, payload) {
      context.commit("UPDATE_COLORS", payload);
    },
    toggleSideBar(context) {
      context.commit("UPDATE_SIDEBAR_DRAWER");
    },
    setLoading(context, payload) {
      context.commit("SET_LOADING", payload);
    },
  },
  modules: {},
});
