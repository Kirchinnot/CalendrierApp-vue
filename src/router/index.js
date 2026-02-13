import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CalendarView from "@/views/CalendarView.vue";
import NotFound from "@/views/NoFound.vue";

const routes = [
  {
    path: "/",
    component: CalendarView,
    meta: { requiresAuth: true }, // 🔒 protégée
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: "/register",
    component: RegisterView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("currentUser");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (
    (to.path === "/login" || to.path === "/register") &&
    isAuthenticated
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
