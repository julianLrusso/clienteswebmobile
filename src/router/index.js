import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Profile from '@/pages/Profile.vue';
import Posts from '@/pages/Posts.vue';
import Register from '@/pages/Register.vue';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {path: '/', component: Home},
  {path: '/publicaciones', component: Posts},
  {path: '/ingresar', component: Login},
  {path: '/registrarse', component: Register},
  {path: '/perfil', component: Profile},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
