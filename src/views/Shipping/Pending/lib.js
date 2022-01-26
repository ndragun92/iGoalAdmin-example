const { default: axios } = require("axios");

async function getPendingOrderProducts() {
  try {
    const res = await axios.get(`orders/products`);
    return res.data;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function confirmProducts(products) {
  let data = {
    data: products,
  };
  try {
    const response = await axios.post(`orders/confirmOrderItems`, data);
    return response.data;
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

export { getPendingOrderProducts, confirmProducts };
