<script>
import { subscribeToAuthStateChanges } from '@/services/auth';
import ChangeNameForm from '@/components/profile/ChangeNameForm.vue';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue';
import AlertMessage from '@/components/utils/AlertMessage.vue';
import PostList from '@/components/profile/UserPostList.vue';

export default {
  name: "Profile",
  components: { ChangeNameForm, ChangePasswordForm, AlertMessage, PostList },
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
  <h1 class="text-3xl mb-4">Perfil</h1>

  <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

  <section>
    <div>
      <p>{{ user.bio }}</p>
    </div>
  </section>

  <!-- TODO: Poner esto en una ruta de editar. Poner también la bio. -->
  <section class="max-w-3xl flex gap-6">
    <ChangeNameForm :initial-name="user.name" />
    <ChangePasswordForm />
  </section>

  <section class="mt-5">
    <PostList v-if="user.id" :user_id="user.id"/>
  </section>

</template>