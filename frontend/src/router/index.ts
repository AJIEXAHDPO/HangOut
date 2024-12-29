import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import ContactsPage from '@/pages/ContactsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsPage,
    },
  ],
})

export default router
