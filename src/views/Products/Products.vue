<template>
  <v-container>
    <BaseCard
      heading="Products Management"
      primaryButton="New product"
      @primaryClick="openDialog"
    >
      <template v-slot:headerActions>
        <v-btn depressed color="primary" @click="openDialog">
          NEW PRODUCT
        </v-btn>
      </template>

      <template>
        <!-- Table -->
        <v-data-table :headers="headers" :items="products">
          <template v-slot:[`item.slno`]="{ item }">
            {{ products.indexOf(item) + 1 }}
          </template>

          <template v-slot:[`item.image`]="{ item }">
            <v-avatar class="my-2 rounded-lg" size="60" tile>
              <img :src="getImage(item.image)" alt="Loading" />
            </v-avatar>
          </template>

          <template v-slot:[`item.product_Name`]="{ item }">
            <div>{{ item.product_Name }}</div>
            <div class="caption"># {{ item.product_code }}</div>
          </template>

          <template v-slot:[`item.active`]="{ item }">
            <v-chip v-if="item.active == true" label small color="#64DD17"
              >Active</v-chip
            >
            <v-chip v-else label small color="#FF3D00">Inactive</v-chip>
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
                  <v-list-item-title class="caption">Edit</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title
                    class="caption"
                    @click="changeImageDialog(item)"
                    >Change image</v-list-item-title
                  >
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title
                    class="caption"
                    v-if="item.active == true"
                    @click="_deActivateProduct(item)"
                    >Deactivate</v-list-item-title
                  >
                  <v-list-item-title
                    class="caption"
                    v-else
                    @click="_activateProduct(item)"
                    >Activate</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
        <!-- End -->
      </template>
    </BaseCard>
    <ProductForm
      :dialog.sync="dialog"
      :_editItems.sync="editedItem"
      :editIndex.sync="editIndex"
      @onSave="onSave"
    />
    <ChangeImageDialog
      :imageDialog.sync="imageDialog"
      :image.sync="editedItem.image"
      @save="updateImage"
    />
  </v-container>
</template>

<script>
import { getImage } from "../../common/utils";
import BaseCard from "../../components/BaseCard.vue";
import {
  getProducts,
  saveAndUploadImage,
  updateProduct,
  updateProductImage,
  activateProduct,
  deActivateProduct,
} from "./lib";
import ProductForm from "../../components/ProductForm.vue";
import ChangeImageDialog from "./components/ChangeImageDialog.vue";
import { mapActions } from "vuex";
export default {
  name: "Products",
  components: { BaseCard, ProductForm, ChangeImageDialog },
  data: () => ({
    products: [],
    dialog: false,
    imageDialog: false,
    editIndex: -1,
    headers: [
      { text: "Slno", value: "slno" },
      { text: " ", value: "image" },
      // { text: "Code", value: "product_code" },
      { text: "Name & Code", value: "product_Name" },
      { text: "Category", value: "category", align: " d-none" },
      { text: "Category", value: "category_name" },
      { text: "Supplier Code", value: "sup_code" },
      { text: "Price", value: "price" },
      { text: "Active", value: "active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedItem: {
      product_code: "",
      product_Name: "",
      category: "",
      description: "",
      sup_code: "",
      image: "",
      price: 0,
      valid_date: null,
      qty: 0,
      shipping_type: "",
      colors: [],
      branches: [],
    },
    defaultItem: {
      product_code: "",
      product_Name: "",
      category: "",
      description: "",
      sup_code: "",
      image: "",
      price: 0,
      valid_date: null,
      qty: 0,
      shipping_type: "",
      colors: [],
      branches: [],
    },
  }),
  methods: {
    ...mapActions({
      setLoading: "setLoading",
    }),
    getImage: getImage,
    async _activateProduct(item) {
      await activateProduct(item);
      await this.initialize();
    },
    async _deActivateProduct(item) {
      deActivateProduct(item);
      await this.initialize();
    },
    async initialize() {
      this.products = await getProducts();
    },
    editItem(item) {
      this.editIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    changeImageDialog(item) {
      this.editIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.imageDialog = true;
    },
    openDialog() {
      this.editIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    async onSave() {
      if (this.editIndex !== -1) {
        let res = await updateProduct(this.editedItem);
        if (res.status == "Success") {
          this.setLoading(true);
          await this.initialize();
          this.editedItem = Object.assign({}, this.defaultItem);
          this.dialog = false;
          this.setLoading(false);
          this.$notify({
            title: "Success",
            text: "Product updated successfully",
            type: "success",
          });
        }
      } else {
        this.setLoading(true);
        const res = await saveAndUploadImage(this.editedItem);
        if (res.status == "Success") {
          await this.initialize();
          this.setLoading(false);
          this.editedItem = Object.assign({}, this.defaultItem);
          this.dialog = false;
          this.$notify({
            title: "Success",
            text: "Product added successfully",
            type: "success",
          });
        } else if (res.status == "Error") {
          this.setLoading(false);
          this.$notify({
            title: "Error",
            text: `Product code already exists, ${this.editedItem.product_code}`,
            type: "error",
          });
        }
      }
    },
    async updateImage() {
      this.setLoading(true);
      const res = await updateProductImage(
        this.editedItem.product_code,
        this.editedItem.image
      );
      this.products[this.editIndex].image = res.data;
      if (res.res.statusCode == 200) {
        this.imageDialog = false;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.setLoading(false);
        this.$notify({
          title: "Success",
          text: "Product image updated successfully",
          type: "success",
        });
        this.imageModal = false;
      }
      if (res.statusCode == 409) {
        this.setLoading(false);
        this.$notify({
          title: "Error",
          text: `Product code already exists, ${res.product_code}`,
          type: "error",
        });
      }
    },
  },
  async mounted() {
    this.initialize();
  },
};
</script>

<style></style>
