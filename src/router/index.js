import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Recommendation from "../views/Recommendation.vue";
import Registration from "../views/Registration.vue";
import Details from "../views/WorkDetails.vue";
import WatchList from "../views/WatchList.vue";
import SeenList from "../views/SeenList.vue";
import AddReview from "../views/AddReview.vue";
import AddDiscussion from "../views/AddDiscussion.vue";
import ReviewsWork from "../views/ReviewsWork.vue";
import ReviewsUser from "../views/ReviewsUser.vue";
import DiscussionsUser from "../views/DiscussionsUser.vue";
import DiscussionsWork from "../views/DiscussionsWork.vue";
import AdminStatistics from "../views/AdminStatistics.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
  {
    path: "/recommendation",
    name: "recommendation",
    component: Recommendation,
  },
  {
    path: "/registration",
    name: "registration",
    component: Registration,
  },
  {
    path: "/details/:type/:id",
    name: "details",
    component: Details,
  },
  {
    path: "/watchlist",
    name: "watchlist",
    component: WatchList,
  },
  {
    path: "/seenlist",
    name: "seenlist",
    component: SeenList,
  },
  {
    path: "/review/:type/:id",
    name: "/review/:type/:id",
    component: AddReview,
  },
  {
    path: "/discussion/:type/:id",
    name: "/discussion/:type/:id",
    component: AddDiscussion,
  },
  {
    path: "/reviews-work/:type/:id",
    name: "/reviews-work/:type/:id",
    component: ReviewsWork,
  },
  {
    path: "/reviews-user",
    name: "/reviews-user",
    component: ReviewsUser,
  },
  {
    path: "/discussions-user",
    name: "/discussions-user",
    component: DiscussionsUser,
  },
  {
    path: "/discussions-work/:type/:id",
    name: "/discussions-work/:type/:id",
    component: DiscussionsWork,
  },
  {
    path: "/statistics",
    name: "/statistics",
    component: AdminStatistics,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
