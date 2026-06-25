<script>
import { subscribeToAuthStateChanges } from '@/services/auth';
import AlertMessage from '@/components/utils/AlertMessage.vue';
import PostList from '@/components/profile/UserPostList.vue';

export default {
  name: "Profile",
  components: { AlertMessage, PostList },
  data() {
    return {
     user: {
        id: "",
        name: "",
        email: "",
        bio: "",
      },
      error: null,
    };
  },
  async mounted() {
    try {
      await subscribeToAuthStateChanges(newUserData => this.user = newUserData)
    } catch (e) {
      this.error = e.message;
    }
  },
}
</script>

<template>
  <div class="flex mb-4 justify-between">
    <h1 class="text-3xl">Perfil</h1>

    <RouterLink class="bg-transparent hover:bg-indigo-800 text-indigo-950 font-semibold hover:text-white py-2 px-4 border border-indigo-800 hover:border-transparent rounded" 
      to="/editar-perfil">
        Editar
    </RouterLink>
  </div>

  <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

  <section>
    <h2 class="sr-only">Mi biografía</h2>
    <div>
      <p>{{ user.bio }}</p>
    </div>
  </section>

  <section class="mt-5">
    <PostList v-if="user.id" :user_id="user.id"/>
  </section>

</template>