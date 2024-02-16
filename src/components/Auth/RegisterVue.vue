<template>
  <div class="container">
    <h1>Your Feedback Matters</h1>
    <form @submit.prevent="register">
      <input type="text" placeholder="Name" v-model="formData.name" required />
      <input
        type="email"
        placeholder="Email"
        v-model="formData.email"
        @change="isEmailExists"
        required
      />
      <span v-if="isExists" class="text-danger"
        >{{ formData.email }} is already taken</span
      >
      <input
      :type="viewPassword ? 'text' :'password'"
        placeholder="Password"
        v-model="formData.password"
        required
      />
      <span @click="toggleView()" class="view-password">{{ viewPassword ? 'Hide' : 'Show' }} Password</span>
      <button :disabled="processing" type="submit">{{processing ? "Processing" : "Register"}}</button>
    </form>
    <p>
      Already have an account?
      <router-link :to="{ name: 'login' }"><span>Login</span></router-link>
    </p>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      formData: {
        email: null,
        password: null,
        name: null,
      },
      processing: false,
      isExists: false,
      viewPassword: false,
    };
  },
  methods: {
    ...mapMutations(["setUser"]),
    async register() {
      try {
        if (this.isExists) {
          this.triggerSwal("Email has already been taken!", "error");
          return;
        }
        this.processing = true;
        const response = await this.$axios.post("/register", this.formData);
        localStorage.setItem("token", response.data.data.token);
        const user = response.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        this.setUser(JSON.stringify(user));
        this.setUser(JSON.stringify(user));
        this.triggerSwal(response.data.message, "success");
        this.triggerSwal(response.data.message, "success");
      } catch (e) {
        this.triggerSwal(e.response.data.message, "error");
      } finally {
        this.processing = false;
      }
    },
    async isEmailExists() {
      try {
        const response = await this.$axios.post(
          "/is-email-exists",
          this.formData
        );
        this.isExists = response.data.data.isExists;
      } catch (e) {
        console.log(e);
      }
    },
    toggleView() {
     this.viewPassword = !this.viewPassword;
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;600&family=Pacifico&display=swap");
* {
  box-sizing: border-box;
  font-family: Montserrat, sans-serif;
}

.container {
  width: 80%;
  max-width: 900px;
  height: 70vh;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.text-danger {
  color: rgb(153, 8, 8);
  text-align: start;
  font-size: 14px;
}
.view-password{
  font-size: 12px;
  color: rgb(14, 12, 116);
  text-align: end;
  cursor: pointer;
}
.container form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 400px;
}
.container h2 {
  word-spacing: 48px;
  font-weight: bold !important;
}
.container form input {
  padding: 9px;
  border-radius: 5px;
  border: 1px solid #ca8a04;
  background-color: #001d3d;
  color: #94a3b8;
  outline-color: #ca8a04;
  font-family: Montserrat, sans-serif;
}

.container form button {
  padding: 9px;
  border-radius: 5px;
  background-color: #ca8a04;
  color: #001d3d;
  font-weight: bold;
  font-family: Montserrat, sans-serif;
  cursor: pointer;
  border: none;
}

.container p span {
  color: #ca8a04;
  cursor: pointer;
  font-weight: bold;
  font-family: Pacifico, cursive;
  text-decoration: none;
}
@media screen and (max-width: 400px) {
  .container form input,
  .container form button {
    width: 270px !important;
  }
}
</style>
