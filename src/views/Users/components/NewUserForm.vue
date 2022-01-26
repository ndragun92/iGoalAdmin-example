<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="editedItem.firstName"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="editedItem.lastName"
            :rules="nameRules"
            :counter="10"
            label="Last name"
            required
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="editedItem.phone"
            :rules="phoneRules"
            label="Phone"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-autocomplete
            :items="branches"
            item-text="branch_name"
            item-value="branch_code"
            v-model="editedItem.branch"
            label="Branch"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
            :items="roles"
            item-text="name"
            item-value="id"
            v-model="editedItem.role"
            label="Role"
          />
        </v-col>
      </v-row>

      <v-row v-if="editIndex < 0">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="editedItem.password"
            :rules="passWordRules"
            :counter="20"
            label="Password"
            required
          />
        </v-col>
      </v-row>

      <v-row class="justify-end">
        <v-btn text color="error" @click="cancel"> Cancel </v-btn>
        <v-btn text color="primary" @click="save"> Save </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
import { createUser, updateUser } from "../lib";

export default {
  name: "NewUserForm",
  props: {
    _editItem: {
      type: Object,
      default: () => ({
        user_id: "",
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        branch: 0,
        role: 0,
      }),
    },
    editIndex: Number,
  },
  watch: {
    _editItem(val) {
      if (val.user_id !== "") {
        this.editedItem = Object.assign({}, this._editItem);
      }
    },
  },
  data: () => ({
    valid: false,
    editedItem: {
      user_id: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      branch: 0,
      role: 0,
    },
    defaultItem: {
      user_id: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      branch: 0,
      role: 0,
    },
    roles: [
      { id: 1, name: "Sales Officer" },
      { id: 2, name: "Branch Admin" },
      { id: 3, name: "Supplier" },
      { id: 5, name: "Admin" },
    ],
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v?.length <= 10 || "Name must be less than 10 characters",
    ],
    passWordRules: [
      (v) => !!v || "Password is required",
      (v) => v?.length >= 4 || "Password must be more than 4 characters",
      (v) => v?.length <= 20 || "Password must be less than 20 characters",
    ],
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => /^\d+$/.test(v) == true || "Only numbers are allowed",
    ],
  }),
  computed: {
    ...mapGetters(["branches"]),
  },
  methods: {
    cancel() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editIndex = -1;
    },
    async save() {
      if (this.editIndex === -1) {
        await createUser(this.editedItem);
        this.editedItem = Object.assign({}, this.defaultItem);
        this.$emit("refresh");
      } else {
        await updateUser(this.editedItem);
        this.editedItem = Object.assign({}, this.defaultItem);
        this.$emit("refresh");
      }
    },
  },
};
</script>

<style></style>
