import axios from "axios";

async function getAllUsers() {
  try {
    let response = await axios.get("auth");
    return response.data;
  } catch (error) {
    return error;
  }
}

async function createUser(data) {
  let url = "";

  switch (data.role) {
    case 1:
      url = `auth/createSaleOfficer`;
      break;
    case 2:
      url = `auth/createBranchAdmin`;
      break;
    case 3:
      url = `auth/createSupplier`;
      break;
    case 5:
      url = `auth/createAdmin`;
      break;
    default:
      break;
  }
  let body = {
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    password: data.password,
    branch: data.branch,
  };
  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(data) {
  let { user_id } = data;

  let body = {
    role: data.role,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    branch: data.branch,
  };
  try {
    const response = await axios.put(`auth/updateUser/${user_id}`, body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export { getAllUsers, createUser, updateUser };
