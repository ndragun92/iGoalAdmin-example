<template>
  <v-container fluid fill-height class="container">
    <div class="page-container">
      <div class="login-card">
        <div class="login-card_body">
          <h1 class="login-card_title">Welcome</h1>
          <form @submit.prevent="login" class="login-card_form">
            <input
              v-model="phone"
              class="login-card_input"
              placeholder="Phone"
              required
            />
            <input
              v-model="password"
              type="password"
              class="login-card_input"
              placeholder="Password"
              required
            />
            <button type="submit" class="login-card_btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      phone: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("auth/adminSignIn", {
          phone: this.phone,
          password: this.password,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  align-items: center;
  justify-content: center;
  /* background: url("../assets/login.jpg"); */
  /* background: linear-gradient(0deg, rgba(8, 8, 8, 0.8), rgba(8, 8, 8, 0.8)),
    url("../assets/login.jpg"); */
}

.page-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px;
}

.login-card {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 100%;
  max-width: 400px;
  margin: 0 5px;
}
.login-card .login-card_body {
  padding: 35px 30px;
}
.login-card .login-card_body .login-card_title {
  font-size: 35px;
  font-weight: 600;
  margin-bottom: 60px;
  text-align: left;
}
.login-card .login-card_body .login-card_input,
.login-card .login-card_body .login-card_btn {
  width: 100%;
  display: block;
  padding: 0 10px;
  height: 45px;
  border-radius: 4px;
  border: 1px solid #b4b4b4;
  outline: 0;
  font-size: 15px;
  margin-bottom: 15px;
  box-shadow: 0 0 0 0px rgba(108, 99, 255, 0.9);
}
.login-card .login-card_body .login-card_input:focus,
.login-card .login-card_body .login-card_btn:focus {
  box-shadow: 0 0 0 5px rgba(108, 99, 255, 0);
  border-color: #6c63ff;
}
.login-card .login-card_body .login-card_input:focus {
  -webkit-transition: all 900ms cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 900ms cubic-bezier(0.23, 1, 0.32, 1);
}
.login-card .login-card_body .login-card_btn {
  text-align: center;
  background: #6c63ff;
  border-width: 0;
  color: white;
  font-size: 17px;
}
.login-card .login-card_body .login-card_btn:active {
  -webkit-transition: all 900ms cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 900ms cubic-bezier(0.23, 1, 0.32, 1);
  background: rgba(108, 99, 255, 0.9);
}
.login-card .login-card_footer {
  padding: 20px 30px 25px;
}
.login-card .login-card_footer .login-card_subtitle {
  opacity: 0.8;
  margin-bottom: 8px;
  font-size: 13px;
}
</style>
