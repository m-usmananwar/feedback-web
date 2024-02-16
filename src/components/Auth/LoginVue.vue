<template>
  <div class="container">
    <h1>Your Feedback Matters</h1>
    <form @submit.prevent="login">
      <input
        type="email"
        placeholder="Email"
        v-model="formData.email"
        required
      />
      <input
        :type="viewPassword ? 'text' : 'password'"
        placeholder="Password"
        v-model="formData.password"
        required
      />
      <span
        v-if="formData.password !== null"
        @click="toggleView()"
        class="view-password"
        >{{ viewPassword ? "Hide" : "Show" }} Password</span
      >
      <button :disabled="processing" type="submit"> {{processing ? "Processing" : "Login"}}</button>
    </form>
    <p class="montserrat-family">
      Don't have an account?
      <router-link :to="{ name: 'register' }"
        ><span>Register</span></router-link
      >
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
      },
      processing: false,
      viewPassword: false,
    };
  },
  methods: {
    ...mapMutations(["setUser"]),
    async login() {
      try {
        this.processing = true;
        const response = await this.$axios.post("/login", this.formData);
        console.log(response);
        localStorage.setItem("token", response.data.data.token);
        const user = response.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        this.setUser(JSON.stringify(user));
        this.triggerSwal(response.data.message, "success");
        this.$router.push({
          name: "feedbacks"
        });
      } catch (e) {
        this.triggerSwal(e.response.data.message, "error");
      } finally {
        this.processing = false;
      }
    },
    toggleView() {
      this.viewPassword = !this.viewPassword;
    },
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
.view-password {
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
