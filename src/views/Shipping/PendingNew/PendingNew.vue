<template>
  <div>
    <plain-card>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="4" lg="4" xl="3">
            <v-autocomplete
                label="Branch"
                :items="$store.getters['branches']"
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
              <v-icon right dark> mdi-cloud-download</v-icon>
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
    </plain-card>
    <base-card :heading="form_title">
      <!-- Tabs start-->
      <v-tabs>
        <v-tab @click="onSelectTab('Pending products', 'Pending')">Pending</v-tab>
        <v-tab @click="onSelectTab('Confirmed products', 'Confirmed')">Confirmed</v-tab>
        <v-tab @click="onSelectTab('Partially shipped products', 'Shipped')">Partially Shipped</v-tab>
      </v-tabs>
      <v-divider/>
      <!-- Tabs end-->

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
          :items="returnPendingData"
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
                      <v-checkbox v-model="selected" :value="item"/>
                      <v-chip label small class="mr-2">{{
                          item.branch_code
                        }}
                      </v-chip>
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
                    <img :src="getImage(item.image)" alt="Loading"/>
                  </v-avatar>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>

    </base-card>

    <!-- Shipping Details Dialog -->
    <new-shipping-dialog :dialog="dialog" :shippingData="selected" @close="dialog = false" @add-data="onAddData" />
  </div>
</template>

<script>
import PlainCard from "@/components/PlainCard";
import BaseCard from "@/components/BaseCard";
import {getImage} from "@/common/utils";
import {getPendingOrderProducts} from "@/views/Shipping/Pending/lib";
import NewShippingDialog from "@/views/Shipping/Pending/components/NewShippingDialog";

export default {
  components: {NewShippingDialog, BaseCard, PlainCard},
  data: () => ({
    form_title: "Pending products",
    selected_tab: "Pending",
    filters: {
      branch: null,
    },
    search: '',
    dialog: false,
    pagination: {
      page: 1,
      itemsPerPage: 12,
      pageStart: 0,
      pageStop: 0,
      pageCount: 0,
      itemsLength: 10,
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
    pending_data: [],
    selected: []
  }),
  computed: {
    returnPendingData() {
      let data = this.pending_data
      if (this.selected_tab) {
        data = data.filter(obj => obj.status === this.selected_tab)
      }
      if (this.filters.branch) {
        data = data.filter(obj => obj.branch_code === `${this.filters.branch}`)
      }
      return data
    }
  },
  async created() {
    await this.$store.dispatch('setLoading', true)
    await this.onInit()
    await this.$store.dispatch('setLoading', false)
  },
  methods: {
    async onInit() {
      this.selected = [];
      this.pending_data = await getPendingOrderProducts();
      if(this.pending_data.length) {
        this.pending_data = this.pending_data.map(obj => {
          obj.carton_details = [{
            ctn_no: null,
            pcs_ctn: null,
            ctns: null,
            qty: 0,
            total: 0,
          }]
          return obj
        })
      }
    },
    onConfirm() {
      console.log('confirm');
    },
    onSelectTab(title, tab) {
      if (title) {
        this.form_title = title
      }
      if (tab) {
        this.selected_tab = tab
      }
    },
    getPageText({pageStart, pageStop, itemsLength}) {
      return `${pageStart}-${pageStop} of ${itemsLength}`;
    },
    getImage: getImage,
    onAddData(data) {
      console.log('onAddData', data);
    }
  }
}
</script>
