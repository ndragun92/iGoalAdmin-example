<template>
  <v-row justify="center">
    <v-dialog v-model="_dialog" persistent max-width="750px">
      <v-card>
        <v-card-title>
          <span class="text-h5"></span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12" class="d-flex justify-center">
                <v-avatar
                  class="rounded-lg"
                  size="250"
                  tile
                  v-if="_editIndex > -1"
                >
                  <img :src="getImage(editedItem.image)" alt="Loading" />
                </v-avatar>
                <div style="width: 350px; margin: 0 auto" v-else>
                  <vue-image-chooser
                    name="image-picker"
                    @change="uploadFile"
                    :progress="progress"
                    :error="error"
                  />
                </div>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Product code"
                  required
                  v-model="editedItem.product_code"
                />
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  label="Product Name"
                  v-model="editedItem.product_Name"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  :items="['Air', 'Ship', 'Air & Ship']"
                  label="Transport mode"
                  v-model="editedItem.shipping_type"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  :items="categories"
                  label="Category"
                  item-text="category_name"
                  item-value="category_code"
                  v-model="editedItem.category"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Supplier code"
                  required
                  v-model="editedItem.sup_code"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Minimum order quantity"
                  required
                  v-model="editedItem.qty"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Price"
                  required
                  v-model="editedItem.price"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  label="Branches"
                  chips
                  multiple
                  small-chips
                  deletable-chips
                  :items="branches"
                  item-text="branch_name"
                  item-value="branch_code"
                  v-model="editedItem.branches"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  label="Colors"
                  chips
                  multiple
                  small-chips
                  deletable-chips
                  :items="colors"
                  item-text="name"
                  item-value="id"
                  v-model="editedItem.colors"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-switch
                  v-model="validDateSwitch"
                  inset
                  :label="`Is valid date available`"
                ></v-switch>
              </v-col>
              <v-col cols="12" sm="6" md="12" v-if="validDateSwitch">
                <v-menu
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.valid_date"
                      label="Valid till date"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.valid_date"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-textarea
                  label="Description"
                  v-model="editedItem.description"
                  rows="1"
                />
              </v-col>
            </v-row>
          </v-container>
          <small>* indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="_dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import { getImage } from "../common/utils";
export default {
  name: "ProductForm",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    _editItems: {
      type: Object,
    },
    editIndex: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    ...mapGetters(["categories", "branches", "colors"]),
    editedItem: {
      get() {
        return this._editItems;
      },
      set(value) {
        this.$emit("update:_editItems", value);
      },
    },
    _dialog: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit("update:dialog", value);
      },
    },
    _editIndex: {
      get() {
        return this.editIndex;
      },
      set(value) {
        this.$emit("update:editIndex", value);
      },
    },
  },
  watch: {
    _dialog(val) {
      if (!val) {
        // this._editIndex = -1;
        // this.$emit("update:editIndex", val);
      }
    },
    validDateSwitch(val) {
      if (!val) {
        this.editedItem.valid_date = null;
      }
    },
  },
  data: () => ({
    validDateSwitch: false,
    selectedImage: null,
    progress: null,
    error: null,
  }),
  methods: {
    getImage: getImage,
    uploadFile(file) {
      this.editedItem.image = file;
    },
    save() {
      this.$emit("onSave");
    },
  },
};
</script>

<style></style>
