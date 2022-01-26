import axios from "axios";
import store from "../store";

export async function getAllCategories() {
  axios
    .get("Category-master")
    .then((res) => {
      store.dispatch("addToCategories", { data: res.data });
    })
    .catch((err) => console.log(err));
}

export async function getAllBranches() {
  axios
    .get("branch-master")
    .then((res) => {
      store.dispatch("addToBranches", { data: res.data });
    })
    .catch((err) => console.log(err));
}

export async function getAllColors() {
  axios
    .get("color-master")
    .then((res) => {
      store.dispatch("addToColors", { data: res.data });
    })
    .catch((err) => console.log(err));
}
