import axios from "axios";

async function getAllRequests() {
  try {
    const response = await axios.get(`request-product`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function moveToProduct(request_id, data) {
  try {
    const res = await axios.post(
      `request-product/moveProductImage/${request_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return error;
  }
}

async function rejectRequest(id, remark) {
  try {
    const res = await axios.patch(`request-product/reject/${id}`, { remark });
    return res.data;
  } catch (error) {
    return error;
  }
}

export { getAllRequests, moveToProduct, rejectRequest };
