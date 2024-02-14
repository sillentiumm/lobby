
import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Pentago from '../components/Pentago.vue'
import Boxes from '../components/Boxes.vue'
import TicTacToeBig from '../components/TicTacToeBig.vue'

  const routes = [
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
    {
      path: '/boxes',
      name: 'boxes',
      component: Boxes
    },
    {
      path: '/tictactoe',
      name: 'tictactoe',
      component: TicTacToeBig
    },
  ]
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })


export default router

