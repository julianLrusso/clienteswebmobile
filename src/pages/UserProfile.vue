<script>
import AlertMessage from '@/components/utils/AlertMessage.vue';
import PostList from '@/components/profile/UserPostList.vue';
import { getUserProfileById } from '@/services/profile';

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
    this.user = await getUserProfileById(this.$route.params.id);
  },
}
</script>

<template>
    <h1 class="text-3xl mb-4">Perfil de {{ user.name }}</h1>

  <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

  <section>
    
    <div>
      <p>{{ user.bio }}</p>
    </div>
  </section>

  <section class="mt-5">
    <PostList v-if="user.id" :user_id="user.id"/>
  </section>

</template>