<template>
  <div class="container">
    <div class="headings">
    <h2>{{ feedback.title }} Details</h2>
    <router-link :to="{name:'feedbacks'}" class="return-back">Back</router-link>
    </div>
    <div class="feedback">
      <div class="row-one">
        <p>
          Title: <span class="span-text">{{ feedback.title }}</span>
        </p>
        <p>
          Category: <span class="span-text">{{ feedback.category }}</span>
        </p>
        <p>
          Total Comment:
          <span class="span-text">{{ feedback.comments_count }}</span>
        </p>
      </div>
      <div class="row-one">
        <p>
          User:
          <span class="span-text">{{ feedback?.user?.name ?? "N/A" }}</span>
        </p>
        <p>
          User Email:
          <span class="span-text">{{ feedback?.user?.email ?? "N/A" }}</span>
        </p>
      </div>
      <div class="row-one">
        <p>
          Description: <span class="span-text">{{ feedback.description }}</span>
        </p>
      </div>
    </div>
    <div class="add-comment">
      <form @submit.prevent="addComment">
        <textarea v-model="commentPayload.content"></textarea>
        <button type="submit" :disabled="processing">
          {{ processing ? "Processing" : "Add" }}
        </button>
      </form>
    </div>
    <template v-if="comments.length > 0">
    <h2>{{ feedback.title }} Comments</h2>
    <div class="comments-listing" v-for="comment in comments" :key="comment.id">
      <p><span>Content:</span>{{comment.content}}</p>
      <p><span>Commented By:</span>{{comment?.user?.name ?? "N/A"}}</p>
      <button class="remove-comment" v-if="isPublisher(comment)" @click="removeComment(comment)">Remove</button>
    </div>
    <button class="load-more" v-if="nextPageUrl" @click="fetchComments(nextPageUrl)">LoadMore</button>
</template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      feedback: {},
      comments: [],
      nextPageUrl: null,
      authUser: null,
      commentPayload: {
        commentable_type: "Feedback",
        commentable_id: this.$route.params.id,
        content: null,
      },
      processing: false
    };
  },
  methods: {
    async fetchFeedback() {
      let id = this.$route.params.id;
      const response = await this.$axios.get(`feedbacks/${id}`);
      this.feedback = response.data.data.feedback;
    },
    async fetchComments(url = null) {
      try {
        let params = {
          commentable_type: "Feedback",
          commentable_id: this.$route.params.id,
        };
        let cUrl = url ?? "comments";
        const response = await this.$axios.get(cUrl, { params: params });
        let data = response.data.data.comments;
        this.comments.push(...data.data);
        this.nextPageUrl = data.next_page_url;
      } catch (e) {
        console.log(e);
      }
    },
    async addComment() {
      try {
        if (!this.isFormValidated()) {
          this.triggerSwal("Please fill required fields", "error");
          return;
        }
        this.processing = true;
        const response = await this.$axios.post(
          "/comments",
          this.commentPayload
        );
        this.triggerSwal(response.data.message, "success");
        this.feedback.comments_count++;
        this.comments = [];
        this.fetchComments();
      } catch (e) {
        console.log(e);
      } finally {
        this.processing = false;
        this.commentPayload.content = null;
      }
    },
    isFormValidated() {
      return this.commentPayload.content != null;
    },
    isPublisher(comment) {
        return this.authUser.id == comment.user_id;
    },
    async removeComment(comment) {
        const response = await this.$axios.delete(`comments/${comment.id}`);
        this.triggerSwal(response.data.message, "success");
        this.feedback.comments_count--;
        this.comments = [];
        this.fetchComments();
    }
  },
  mounted() {
    this.fetchFeedback();
    this.fetchComments();
    this.authUser = JSON.parse(localStorage.getItem("user"));
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
  display: block;
  margin: 0 auto;
}
.container h2 {
  text-align: start;
}
.feedback {
  background: #001d3d;
  padding: 12px;
  border-radius: 4px;
  color: #ca8a04;
}
.feedback .row-one {
  display: flex;
  justify-content: space-between;
}
.row-one p {
  font-weight: bold;
  font-size: 14px;
}
.span-text {
  color: #94a3b8;
  font-size: 12px;
  font-weight: normal;
}
.add-comment {
  width: 100%;
  margin: 12px 0;
}
.add-comment form {
  display: flex;
  gap: 2px;
}
form textarea {
  width: 70%;
  height: 60px;
  resize: none;
  border-radius: 4px;
}
form button {
  width: 30%;
  cursor: pointer;
  background: #ca8a04;
  color: #001d3d;
  border: none;
  font-weight: bold;
  border-radius: 4px;
}
.comments-listing {
    padding: 12px;
    margin: 8px 0;
    background: #acbdd6;
    border-radius: 4px;
    text-align: start;
}
.comments-listing p{
    color: #001d3d;
    font-weight: normal;
    font-size: 12px;
}
.comments-listing span{
    font-weight: bold;
    font-size: 14px;
    color: #ca8a04;
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
.remove-comment{
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 16px;
    background: #ca8a04;
    font-weight: medium;
    border: none;
}
.headings {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.return-back{
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 16px;
    background: #ca8a04;
    text-align: center;
    font-weight: bold;
    border: none;
    text-decoration: none;
}
</style>
