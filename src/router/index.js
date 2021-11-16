import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Recommendation from "../views/Recommendation.vue";
import Registration from "../views/Registration.vue";
import Details from "../views/WorkDetails.vue";

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
    path:"/recommendation",
    name: "recommendation",
    component: Recommendation
  },
  {
    path:"/registration",
    name: "registration",
    component: Registration
  },
  {
    path: "/details/:type/:id",
    name:"details",
    component: Details
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
