import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import Profile from '@/pages/Profile.vue';
import Posts from '@/pages/Posts.vue';
import Register from '@/pages/Register.vue';
import EditProfile from '@/pages/EditProfile.vue';
import { createRouter, createWebHistory } from 'vue-router'
import { subscribeToAuthStateChanges } from '@/services/auth';
import UserProfile from '@/pages/UserProfile.vue';

const routes = [
  {path: '/', component: Home},
  {path: '/publicaciones', component: Posts, meta: {auth: true}},
  {path: '/ingresar', component: Login},
  {path: '/registrarse', component: Register},
  {path: '/perfil', component: Profile, meta: {auth: true}},
  {path: '/editar-perfil', component: EditProfile, meta: {auth: true}},
  {path: '/usuario/:id', component: UserProfile, meta: {auth: true}},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

let user = {
  id: null,
  email: null,
}
subscribeToAuthStateChanges(userData => user = userData);

router.beforeEach((to, from) => {
  if(to.meta.auth && user.id === null) {
    return '/ingresar';
  }
});

export default router
