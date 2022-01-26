<template>
  <v-container>
    <BaseCard heading="Product Requests">
      <template v-slot:headerActions>
        <v-row class="d-flex align-center">
          <v-col class="pt-10">
            <v-text-field
              label="Search"
              prepend-icon="mdi-magnify"
              v-model="search"
            />
          </v-col>
          <v-col>
            <v-data-footer
              :pagination.sync="pagination"
              :options.sync="options"
              :items-per-page-options="[2, 4, 8, 12]"
            >
              <template v-slot:page-text="pagetext">
                {{ getPageText(pagetext) }}
              </template>
            </v-data-footer>
          </v-col>
        </v-row>
      </template>

      <v-data-iterator
        :items="requests"
        :options="options"
        @pagination="
          (val) => {
            pagination = val;
          }
        "
        hide-default-footer
        :search.sync="search"
      >
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="mx-auto rounded-xl"
                max-width="344"
                tile
                outlined
                flat
              >
                <v-img
                  height="200px"
                  :src="getImage(item.image)"
                  contain=""
                ></v-img>

                <v-card-title> {{ item.product_name }} </v-card-title>

                <v-card-subtitle>
                  <p class="caption">
                    # {{ item.product_code }}
                    <v-chip small label color="#7fdbff" class="ml-5">{{
                      item.branch
                    }}</v-chip>
                  </p>
                  <p class="caption">Requested by : {{ item.requested_by }}</p>
                </v-card-subtitle>

                <v-card-actions>
                  <v-btn text color="green" @click="moveToInventory(item)"
                    >Add to inventory</v-btn
                  >

                  <v-btn text color="red" @click="_rejectRequest(item)">
                    Reject
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </BaseCard>
    <!-- ProductForm  -->
    <!-- editIndex set to 0 to show image instead of image picker-->
    <ProductForm
      :dialog.sync="dialog"
      :_editItems.sync="editedItem"
      :editIndex="0"
      @onSave="save"
    />
    <!-- End -->

    <RejectReasonDialog
      :visible.sync="rejectDialog"
      :rejectReason.sync="rejectReason"
      @save="rejectRequest"
    />
  </v-container>
</template>

<script>
import { getAllRequests, moveToProduct, rejectRequest } from "./lib";
import BaseCard from "../../components/BaseCard.vue";
import { getImage } from "../../common/utils";
import ProductForm from "../../components/ProductForm.vue";
import { mapActions } from "vuex";
import RejectReasonDialog from "./components/RejectReasonDialog.vue";

export default {
  name: "Requests",
  data: () => ({
    requests: [],
    search: "",
    options: {
      page: 1,
      itemsPerPage: 12,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: true,
      multiSort: true,
      mustSort: true,
    },
    pagination: {
      page: 1,
      itemsPerPage: 12,
      pageStart: 0,
      pageStop: 0,
      pageCount: 0,
      itemsLength: 10,
    },
    dialog: false,
    rejectDialog: false,
    rejectReason: "",
    request_id: 0,
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
  }),
  computed: {},
  watch: {
    rejectDialog() {
      this.rejectReason = "";
    },
  },
  methods: {
    ...mapActions({
      setLoading: "setLoading",
    }),
    getImage: getImage,
    async initialize() {
      this.requests = await getAllRequests();
    },
    getPageText({ pageStart, pageStop, itemsLength }) {
      return `${pageStart}-${pageStop} of ${itemsLength}`;
    },
    moveToInventory(item) {
      this.request_id = item.id;
      this.editedItem.product_code = item.product_code;
      this.editedItem.product_Name = item.product_name;
      this.editedItem.description = item.description;
      this.editedItem.branches = [item.branch];
      this.editedItem.image = item.image;

      this.dialog = true;
    },
    _rejectRequest(item) {
      this.request_id = item.id;
      this.rejectDialog = true;
    },
    async save() {
      this.setLoading(true);
      let res = await moveToProduct(this._request_id, this.editedItem);

      if (res.statusCode == 200) {
        this.initialize();
        this.$notify({
          title: "Success",
          text: res.message,
          type: "success",
        });
        this.dialog = false;
        this.setLoading(false);
      } else if (res.response.statusCode == 409) {
        this.setLoading(false);
        this.$notify({
          title: "Error",
          text: `Product code already exists, ${res.response.product_code}`,
          type: "error",
        });
      } else {
        this.$notify({
          title: "Error",
          text: `Something went wrong, please try again`,
          type: "error",
        });
        this.setLoading(false);
      }
    },
    async rejectRequest() {
      let res = await rejectRequest(this.request_id, this.rejectReason);

      if (res.statusCode == 200) {
        this.initialize();
        this.$notify({
          title: "Success",
          text: "Request Rejected Successfully",
          type: "success",
        });
        this.rejectDialog = false;
        this.setLoading(false);
      }

      console.log(res);
    },
  },
  async mounted() {
    await this.initialize();
  },
  components: { BaseCard, ProductForm, RejectReasonDialog },
};
</script>

<style></style>
