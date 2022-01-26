<template>
  <div>
    <PlainCard>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4" lg="4" xl="3">
            <v-autocomplete
              label="Branch"
              :items="branches"
              item-text="branch_name"
              item-value="branch_code"
              clearable
              v-model="filters.branch"
            />
          </v-col>
          <v-col cols="12" sm="6" md="5" lg="5" xl="3">
            <v-text-field
              label="Search by Product Name or Code"
              prepend-icon="mdi-magnify"
              v-model="search"
              clearable
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="2" lg="4" class="d-flex justify-center">
            <v-btn color="blue-grey" class="ma-2 white--text">
              Generate Order Request
              <v-icon right dark> mdi-cloud-download </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center">
            <v-btn class="ma-2" color="#4CAF50" @click="onConfirm" dark>
              Confirm selected
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2" class="d-flex justify-center">
            <v-btn class="ma-2" color="success" dark @click="dialog = true">
              Ship selected
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </PlainCard>
    <BaseCard :heading="form_title">
      <!-- Tabs -->
      <template>
        <v-tabs>
          <v-tab
            @click="
              [(form_title = `Pending products`), (selected_tab = 'Pending')]
            "
            >Pending</v-tab
          >
          <v-tab
            @click="
              [
                (form_title = `Confirmed products`),
                (selected_tab = 'Confirmed'),
              ]
            "
            >Confirmed</v-tab
          >
          <v-tab
            @click="
              [
                (form_title = `Partially shipped products`),
                (selected_tab = 'Shipped'),
              ]
            "
            >Partially Shipped</v-tab
          >
        </v-tabs>
        <v-divider />
      </template>
      <!-- End -->

      <template v-slot:headerActions>
        <v-row class="d-flex align-center">
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
        :items="filtered_data"
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
          <v-row class="mt-3">
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
                <v-list-item>
                  <v-list-item-content>
                    <v-row class="align-center pl-3 mt-n6">
                      <v-checkbox v-model="selected" :value="item" />
                      <v-chip label small class="mr-2">{{
                        item.branch_code
                      }}</v-chip>
                      <v-chip label small>NEW ORDER</v-chip>
                    </v-row>
                    <span class="font-weight-regular mt-n4">{{
                      item.product_Name
                    }}</span>
                    <span class="text-caption"># {{ item.product_code }}</span>
                    <span class="text-caption">
                      Order ID : {{ item.order_id }}</span
                    >
                    <span class="text-caption"
                      >Sub Total : {{ item.total_amount }}/-</span
                    >
                    <span class="text-caption"
                      >Order Qty : {{ item.order_qty }}</span
                    >
                    <!-- TODO Show in Partially shipped tab only -->
                    <div v-if="item.status === 'Shipped'">
                      <span class="text-caption"
                        >Shipped Qty : {{ item.shipped_qty }}</span
                      >
                      <span class="text-caption"
                        >Remaining Qty : {{ item.remaining_qty }}</span
                      >
                    </div>
                  </v-list-item-content>

                  <v-avatar class="my-2 rounded-lg" size="80" tile>
                    <img :src="getImage(item.image)" alt="Loading" />
                  </v-avatar>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </BaseCard>

    <!-- Shipping Details Dialog -->
    <NewShippingDialog :dialog.sync="dialog" :shippingData="selected" @add-data="onAddData" />
    <!-- End -->
  </div>
</template>

<script>
import { confirmProducts, getPendingOrderProducts } from "./lib";
import BaseCard from "../../../components/BaseCard.vue";
import { mapActions, mapGetters } from "vuex";
import { getImage } from "../../../common/utils";
import PlainCard from "../../../components/PlainCard.vue";
import NewShippingDialog from "./components/NewShippingDialog.vue";

export default {
  name: "PendingShipment",
  watch: {
    selected_tab() {
      this.selected = [];
    },
    selected() {
      console.log('selected');
      this.selected.forEach((item) => {
        item["carton_details"] = [];
        item.carton_details.push({
          ctn_no: null,
          pcs_ctn: null,
          ctns: null,
          qty: 0,
          total: 0,
        });
      });
      // this.selected.map((item) => {
      // item["carton_details"] = [];
      // item.carton_details.push({
      //   ctn_no: null,
      //   pcs_ctn: null,
      //   ctns: null,
      //   qty: 0,
      //   total: 0,
      // });
      // });
    },
  },
  computed: {
    ...mapGetters(["branches"]),
    filtered_data() {
      let tempData = [...this.pending_data];

      console.log('tempData', tempData);

      tempData = tempData.filter((x) => x.status === this.selected_tab);

      if (this.filters.branch) {
        tempData = tempData.filter(
          (x) => x.branch_code === String(this.filters.branch)
        );
      }

      return tempData;
    },
  },
  data: () => ({
    form_title: "Pending products",
    pending_data: [],
    selected: [],
    selected_tab: "Pending",
    dialog: false,
    filters: {
      branch: null,
    },
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
    search: "",
  }),
  methods: {
    ...mapActions({
      setLoading: "setLoading",
    }),
    getImage: getImage,
    async initialize() {
      this.pending_data = await getPendingOrderProducts();
      this.selected = [];
    },
    getPageText({ pageStart, pageStop, itemsLength }) {
      return `${pageStart}-${pageStop} of ${itemsLength}`;
    },
    async onConfirm() {
      this.setLoading(true);
      console.log('selected debug', this.selected);

      let res = await confirmProducts(this.selected);

      if (res.status == 200) {
        this.$notify({
          title: "Success",
          text: `Product confirmed successfully`,
          type: "success",
        });
      }
      this.initialize();

      this.setLoading(false);
    },
    onAddData(data) {
      console.log('onAddData', {data, selected: this.selected});
      this.selected.push(data)
      console.log(this.selected[0]);
    }
  },
  async mounted() {
    await this.initialize();
  },
  components: { BaseCard, PlainCard, NewShippingDialog },
};
</script>
