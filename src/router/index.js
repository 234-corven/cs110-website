import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import App from "../App.vue";
import SignupView from "../views/SignupView.vue";
import UserProfileView from "../views/UserProfileView.vue";
import ProfileSettings from "../components/ProfileSettings.vue";
import TimeLineView from "../views/TimeLineView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignupView.vue"),
    },
    {
      path: "/profile/self",
      name: "Profile",
      component: UserProfileView,
    },
    {
      path: "/profile/self/settings",
      name: "ProfileSettings",
      component: ProfileSettings,
    },
    {
      path: "/profile/:id",
      name: "user",
      component: UserProfileView,
    },
    {
      path: "/profile/:id/timeline",
      name: "timeline",
      component: TimeLineView,
    },
  ],
});

export default router;
