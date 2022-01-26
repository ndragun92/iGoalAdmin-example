import axios from "axios";
import Vue from "vue";

async function getProducts() {
  try {
    const response = await axios.get(`product`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function saveAndUploadImage(data) {
  console.log(data.image);
  let formData = new FormData();
  formData.append("image", data.image.file, data.image.file.name);
  try {
    const { data: image_name } = await axios.post(
      `product/uploadImage`,
      formData
    );
    let _branches = [];
    let _colors = [];
    for (const branch of data.branches) {
      if (branch.branch_code !== undefined) {
        _branches.push(branch.branch_code);
      } else {
        _branches.push(branch);
      }
    }
    if (data.colors !== null) {
      for (const color of data.colors) {
        if (color.id !== undefined) {
          _colors.push(color.id);
        } else {
          _colors.push(color);
        }
      }
    }
    let _data = {
      product_code: data.product_code,
      product_Name: data.product_Name,
      description: data.description,
      price: data.price,
      qty: data.qty,
      category: data.category,
      sup_code: data.sup_code,
      valid_date: data.valid_date,
      shipping_type: data.shipping_type,
      branches: _branches,
      colors: _colors,
      image: image_name,
    };
    let res = await saveProduct(_data);
    if (res.status == "Success") {
      return res;
    } else if (res.status == "Error") {
      return res;
    }
  } catch (error) {
    return error;
  }
}

async function saveProduct(data) {
  try {
    const response = await axios.post(`product`, data);
    return { status: "Success", data: response.data };
  } catch (error) {
    if (error?.response?.data?.statusCode === 400) {
      return { status: "Error", message: error.response.data.message[0] };
    }
    return { status: "Error", message: error?.response?.data };
  }
}

async function updateProduct(data) {
  // Adding one day to the selected date (To save the correct date on postgreSQL)
  let _valid_date = new Date(data.valid_date);
  if (data.valid_date) {
    _valid_date = _valid_date.setDate(_valid_date.getDate() + 1);
    _valid_date = new Date(_valid_date).toISOString().substr(0, 10);
  } else {
    _valid_date = data.valid_date;
  }

  let _data = {
    product_code: data.product_code,
    product_Name: data.product_Name,
    description: data.description,
    price: data.price,
    qty: data.qty,
    category: data.category,
    sup_code: data.sup_code,
    valid_date: _valid_date,
    shipping_type: data.shipping_type,
    branches: data.branches,
    colors: data.colors,
  };
  try {
    const response = await axios.patch(`product/${data.product_code}`, _data);
    console.log(response);
    return { status: "Success", data: response.data };
  } catch (error) {
    console.log(error?.response?.data);
    if (error?.response?.data?.statusCode === 400) {
      return { status: "Error", message: error.response.data.message[0] };
    }
    return { status: "Error", message: error?.response?.data };
  }
}

async function updateProductImage(product_code, data) {
  console.log(data);
  let formData = new FormData();
  formData.append("image", data.file, data.file.name);
  try {
    let { data } = await axios.post(`product/uploadImage`, formData);

    let _data = data.split("/")[1];

    const res = await axios.post(
      `product/updateImage/${product_code}/${_data}`,
      {}
    );
    return { res: res.data, data };
  } catch (error) {
    console.log(error);
  }
}

async function activateProduct({ product_code }) {
  try {
    await axios.post(`product/activate/${product_code}`, {});
    Vue.notify({
      title: "Product Activated",
      text: "The product has been activated successfully",
      type: "success",
    });
  } catch (error) {
    console.log(JSON.stringify(error));
  }
}

async function deActivateProduct({ product_code }) {
  try {
    await axios.post(`product/deactivate/${product_code}`, {});
    Vue.notify({
      title: "Product Deactivated",
      text: "The product has been deactivated successfully",
      type: "success",
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getProducts,
  saveAndUploadImage,
  updateProduct,
  updateProductImage,
  activateProduct,
  deActivateProduct,
};
