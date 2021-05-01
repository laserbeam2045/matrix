import { createRouter, createWebHistory } from 'vue-router'
import AppContents from '@/pages/AppContents.vue'

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes : [
    {
      name     : 'global',
      path     : '/',
      component: AppContents,
    },
  ],
})

export function routerPush(name, params) {
  if (params !== undefined) return router.push({ name, params })
  else return router.push({ name })
}
