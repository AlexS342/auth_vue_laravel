import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrView from '@/views/auth/RegistrView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/auth/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user',
      name: 'page',
      component: UserView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registr',
      name: 'registr',
      component: RegistrView,
    },
    {
      path: '/forgot_password',
      name: 'forgot_password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password/:token',
      name: 'reset_password',
      component: ResetPasswordView,
    },
  ],
})

export default router
