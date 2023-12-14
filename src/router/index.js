import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Pentago from '../components/Pentago.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/pentago',
      name: 'pentago',
      component: Pentago
    },
  ]
})

export default router
