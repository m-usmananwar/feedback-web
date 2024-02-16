<template>
    <div class="container">
        <div class="action-buttons">
            <div class="heading">Feedback Listing</div>
            <div class="actions">
                <router-link :to="{name: 'feedback.add'}" class="action">Add</router-link>
                <button class="action" @click="logOut">Logout</button>
            </div>
        </div>
        <div class="card" v-for="feedback in feedbacks" :key="feedback.id">
            <div class="row-one">
                <router-link :to="{ name: 'feedback.show', params: { id: feedback.id }}" class="view-detail"><span>Title:</span> {{feedback.title}}</router-link>
                <p><span>Category:</span> {{feedback.category}}</p>
                <p><span>Comments Count:</span> {{feedback.comments_count}}</p>
            </div>
            <div class="row-one">
                <p><span>User:</span> {{feedback.user.name}}</p>
                <p><span>User Email:</span> {{feedback.user.email}}</p>
            </div>
            <div class="row-one">
                <p><span>Description:</span> {{getDescription(feedback)}}</p>
            </div>
            <div class="row-one" v-if="isPublisher(feedback)">
                <router-link :to="{ name: 'feedback.edit', params: { id: feedback.id }}" class="action-btn">Edit</router-link>
                <button class="action-btn" @click="deleteFeedback(feedback.id)">Delete</button>
            </div>
        </div>
        <p v-if="nextPageUrl" @click="fetchFeedbacks(nextPageUrl)" class="load-more">LoadMore</p>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      feedbacks: [],
      nextPageUrl: null,
      payload: {
        category: null,
        user_id: null,
      },
      authUser: null,
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    async fetchFeedbacks(url = null) {
      try {
        let fUrl = url ?? "feedbacks";
        const response = await this.$axios.get(fUrl, this.payload);
        let data = response.data.data.feedbacks;
        this.feedbacks.push(...data.data);
        this.nextPageUrl = data.next_page_url;
      } catch (e) {
        console.log("Error fetching feedback");
      }
    },
    isPublisher(feedback) {
        return feedback.user_id == this.authUser.id;
    },
    getDescription(feedback) {
        return feedback.description.length > 60 ? feedback.description.slice(0, 60) + "...More" : feedback.description; 
    },
    async deleteFeedback(id) {
      try {
        const response = await this.$axios.delete(`feedbacks/${id}`);
        this.triggerSwal(response.data.message, "success");
        this.feedbacks = this.feedbacks.filter((feedback) => feedback.id != id);
      }catch (e) {
        console.log(e);
      }
    },
    async logOut() {
      const response = await this.$axios.post('/logout');
      this.triggerSwal(response.data.message, "success");
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.$router.push({
        name: 'login'
      });
    }
  },
  mounted() {
    this.fetchFeedbacks();
    this.authUser = JSON.parse(localStorage.getItem('user'));
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;600&family=Pacifico&display=swap");
* {
  box-sizing: border-box;
  font-family: Montserrat, sans-serif;
}
.card {
    width: 65%;
    display: block;
    margin: 12px auto;
    border-radius: 4px;
    background: #001d3d;
    padding: 12px;
}
.action-buttons{
    width: 65%;
    display: block;
    margin: 12px auto;
    padding: 12px;
    display: flex;
    justify-content: space-between;
}
.card .row-one {
    display: flex;
    justify-content: space-between;
    color: #94a3b8;
    font-size: 12px;
}
.heading {
    font-size: 20px;
    font-weight: bold;
}
.actions{
    display: flex;
    gap: 10px;
}
.action {
    padding: 4px 12px;
    background: #ca8a04;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    color:#001d3d !important;
}
.row-one span{
    color : #ca8a04;
    font-size: 14px;
    font-weight: bold;
}
.row-one .action-btn{
    padding: 4px 12px;
    border-radius: 4px;
    background: #ca8a04;
    border: none;
    width: 15%;
    cursor: pointer;
    text-decoration: none;
    color: #001d3d;
}
.load-more{
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 16px;
    background: #ca8a04;
    width: 15%;
    text-align: center;
    margin: 0 auto;
    display: block;
    font-weight: bold;
    border: none;
}

.view-detail{
  color: #94a3b8;
}
</style>
