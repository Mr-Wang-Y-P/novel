import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    //路由初始指向
    path: "/",
    name: "home",
    component: () => import("../views/Dashboard.vue"),
    children: [
      {
        path: "/bookList/:categoryId",
        name: "bookList",
        component: () => import("../views/bookList.vue"),
      },
      {
        path: '/home',
        name: 'shouye',
        component: () => import('../views/index.vue')
      }
    ],
    redirect: "/home",
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
