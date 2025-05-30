import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Dashboard.vue"),
    redirect: "/home", // 默认重定向到首页
    children: [
      {
        path: "home", // 注意：现在是相对路径，完整路径为 /home
        name: "shouye",
        component: () => import("../views/index.vue"),
      },
      {
        path: "bookList/:categoryId", // 完整路径为 /bookList/:categoryId
        name: "bookList",
        component: () => import("../views/bookList.vue"),
      },
      {
        path: "bookInfo/:categoryId/:bookUrl", // 完整路径为 /bookInfo/:bookUrl
        name: "bookInfo",
        component: () => import("../views/bookInfo.vue"),
      },
      {
        path: "bookInfo/:categoryId/:bookUrl/:chapterId", // 完整路径为 /bookInfo/:bookUrl/:chapterId
        name: "chapterInfo",
        component: () => import("../views/chapterInfo.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
