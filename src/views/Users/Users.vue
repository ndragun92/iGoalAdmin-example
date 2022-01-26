<template>
  <v-container>
    <v-row>
      <v-col>
        <BaseCard heading="Users Management">
          <template>
            <v-data-table
              :headers="headers"
              :items="users"
              :sort-by="['firstName']"
              :items-per-page="10"
            >
              <template v-slot:[`item.status`]="{ item }" class="test">
                <div
                  v-if="item.status == true"
                  class="pa-1 rounded-circle d-inline-block"
                  style="background-color: green"
                />
                <div
                  v-else
                  class="pa-1 rounded-circle d-inline-block"
                  style="background-color: red"
                />
              </template>

              <template v-slot:[`item.full_name`]="{ item }">
                {{ item.firstName }} {{ item.lastName }}
              </template>

              <template v-slot:[`item.phone`]="{ item }">
                {{ item.phone }}
              </template>

              <template v-slot:[`item.branch`]="{ item }">
                {{ item.branch }}
              </template>

              <template v-slot:[`item.role_name`]="{ item }">
                <v-chip small>{{ titleCase(item.role_name) }}</v-chip>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-menu transition="slide-x-transition" bottom right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon right v-bind="attrs" v-on="on">
                      mdi-dots-vertical
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item link @click="editItem(item)">
                      <v-list-item-title class="caption"
                        >Edit</v-list-item-title
                      >
                    </v-list-item>
                    <!-- TODO Deactivate and activate user needs to be implemented -->
                    <!-- <v-list-item link>
                      <v-list-item-title
                        class="caption"
                        v-if="item.status == true"
                        >Deactivate</v-list-item-title
                      >
                      <v-list-item-title class="caption" v-else
                        >Activate</v-list-item-title
                      >
                    </v-list-item> -->
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </template>
        </BaseCard>
      </v-col>
      <v-col>
        <BaseCard :heading="formTitle">
          <NewUserForm
            :_editItem="editedItem"
            :editIndex="editIndex"
            @refresh="initialize"
          />
        </BaseCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BaseCard from "../../components/BaseCard.vue";
import { titleCase } from "../../common/utils";
import { getAllUsers } from "./lib";
import NewUserForm from "./components/NewUserForm.vue";
export default {
  name: "UserManagement",

  components: { BaseCard, NewUserForm },

  data() {
    return {
      users: [],
      formTitle: "Add new user",
      editedItem: {
        user_id: "",
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        branch: 0,
        role: 0,
      },
      editIndex: -1,
      headers: [
        { text: "", value: "status" },
        {
          text: "Name",
          align: "start",
          value: "full_name",
        },
        { text: "Phone", value: "phone" },
        { text: "Branch", value: "branch" },
        { text: "Role", value: "role_name" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  methods: {
    titleCase: titleCase,
    editItem(item) {
      this.editIndex = this.users.indexOf(item);
      this.editedItem = item;
      this.formTitle = "Edit user";
    },
    async initialize() {
      try {
        this.users = await getAllUsers();
        this.editIndex = -1;
        this.formTitle = "Add new user";
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    await this.initialize();
  },
};
</script>
