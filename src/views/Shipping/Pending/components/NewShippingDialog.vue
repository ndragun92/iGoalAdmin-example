<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="$emit('close', $event)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="addNewRow"> Add </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <div style="border: 1px solid black; padding: 10px; margin: 5px 0" v-for="item in shippingData" :key="item.id">
          <div style="
                  display: grid;
                  grid-template-columns: repeat(5,1fr);
                  gap: 10px;
                ">
            <div>
              <label style="display: block">Product name</label>
              <span v-text="item.product_Name" />
            </div>
            <div>
              <label style="display: block">Product code</label>
              <span v-text="item.product_code" />
            </div>
            <div>
              <label style="display: block">Branch code</label>
              <span v-text="item.branch_code" />
            </div>
            <div>
              <label style="display: block">Order ID</label>
              <span v-text="item.id" />
            </div>
            <div>
              <label style="display: block">Price</label>
              <span v-text="item.price" />
            </div>
            <div>
              <label style="display: block">Total price</label>
              <span>---</span>
            </div>
            <div>
              <label style="display: block">Order quantity</label>
              <span v-text="item.order_qty" />
            </div>
            <div>
              <label style="display: block">Shipped total price</label>
              <span>---</span>
            </div>
            <div>
              <label style="display: block">Shipped quantity</label>
              <span>---</span>
            </div>
            <div>
              <label style="display: block">Remaining quantity</label>
              <span v-text="item.remaining_qty" />
            </div>
            <div>
              <label style="display: block">Shipped current quantity</label>
              <span>---</span>
            </div>
            <div>
              <label style="display: block">Excess Quantity</label>
              <span>---</span>
            </div>
          </div>
          <v-divider style="margin: 10px 0" />
          <template v-if="item.carton_details && item.carton_details.length">
            <div style="display: grid;
                      grid-template-columns: repeat(6,1fr);
                      gap: 10px;
                      border: 1px solid gray;
                      margin-bottom: 5px;
                      " v-for="(itemDetails, itemDetailsIndex) in item.carton_details" :key="`${itemDetailsIndex}--${item.id}`">
              <div style="padding: 5px">
                <label style="display: block">Cat no</label>
                <input type="text" v-model.number="itemDetails.ctn_no">
              </div>
              <div style="padding: 5px">
                <label style="display: block">PCS/CTN</label>
                <input type="text" v-model.number="itemDetails.pcs_ctn">
              </div>
              <div style="padding: 5px">
                <label style="display: block">CTNS</label>
                <input type="text" v-model.number="itemDetails.ctns">
              </div>
              <div style="padding: 5px">
                <label style="display: block">QTY</label>
                <input type="text"  v-model.number="itemDetails.qty">
              </div>
              <div style="padding: 5px">
                <label style="display: block">UNIT PRICE</label>
                <input type="text" placeholder="1">
              </div>
              <div style="padding: 5px">
                <label style="display: block">TOTAL PRICE</label>
                <input type="text" placeholder="1" v-model.number="itemDetails.total">
              </div>
            </div>
          </template>
          <div>
            <button type="button" @click="onAddNewRow(item)">Add new row</button>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewShippingDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    shippingData: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    addNewRow() {
      let d = { ctn_no: null, pcs_ctn: null, ctns: null, qty: 0, total: 0 };
      // this.shippingData[0].carton_details.push(d);
      // this.$forceUpdate();
      this.$emit('add-data', d)
    },
    onAddNewRow(item) {
      const data = { ctn_no: null, pcs_ctn: null, ctns: null, qty: 0, total: 0 };
      item.carton_details.push(data)
      this.$forceUpdate()
    }
  },
};
</script>
