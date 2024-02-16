import { createRouter, createWebHistory } from "vue-router";
import LoginVue from '../components/Auth/LoginVue.vue'
import RegisterVue from '../components/Auth/RegisterVue.vue'
import FeedbackIndex from '../components/Feedback/FeedbackIndex.vue'
import FeedbackDetail from '../components/Feedback/FeedbackDetail.vue'
import FeedbackUpdate from '../components/Feedback/FeedbackUpdate.vue'
import FeedbackAdd from '../components/Feedback/FeedbackAdd.vue'

const router = createRouter({
  history: createWebHistory(''),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginVue,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterVue,
    },
    {
      path: "/feedbacks",
      name: "feedbacks",
      component: FeedbackIndex,
      meta: { requiresAuth: true }
    },
    {
      path: "/feedback/:id/show",
      name: "feedback.show",
      component: FeedbackDetail,
      meta: { requiresAuth: true }
    },
    {
      path: "/feedback/:id/update",
      name: "feedback.edit",
      component: FeedbackUpdate,
      meta: { requiresAuth: true }
    },
    {
      path: "/feedback-add",
      name: "feedback.add",
      component: FeedbackAdd,
      meta: { requiresAuth: true }
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("token")) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.name === "login" && localStorage.getItem("token") || to.name === "register" && localStorage.getItem("token")) {
    next({ name: "feedbacks" });
  } else {
    next();
  }
});

export default router;
