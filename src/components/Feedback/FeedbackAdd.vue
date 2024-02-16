<template>
  <div class="container">
    <h1>Your Feedback Matters</h1>
    <form @submit.prevent="addFeedback">
      <input
        type="text"
        placeholder="Title"
        v-model="formData.title"
        required
      />
      <select v-model="formData.category">
        <option :value="null">Select Category</option>
        <option v-for="cat in categories" :value="cat" :key="cat">
          {{ cat }}
        </option>
      </select>
      <textarea v-model="formData.description"></textarea>
      <button :disabled="processing" type="submit">
        {{ processing ? "Processing" : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        title: null,
        category: null,
        description: null,
      },
      processing: false,
      categories: [
        "Feature",
        "Under Testing",
        "Bug Reported",
        "Bug Resolved",
        "Under Deployment",
        "Deployed",
      ],
    };
  },
  methods: {
    async addFeedback() {
      try {
        if (this.isFormValidated()) {
          this.triggerSwal("Please fill all fields", "error");
          return;
        }
        this.processing = true;
        const response = await this.$axios.post("/feedbacks", this.formData);
        this.triggerSwal(response.data.message, "success");
        this.$router.push({
          name: "feedbacks",
        });
      } catch (e) {
        this.triggerSwal(e.response.data.message, "error");
      } finally {
        this.processing = false;
      }
    },
    isFormValidated() {
      return  !this.formData.title == null || !this.formData.category == null || !this.formData.description ==null;
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
select, textarea{
    background: #001d3d;
    color: #94a3b8;
    padding: 8px;
    border-radius: 4px;
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
