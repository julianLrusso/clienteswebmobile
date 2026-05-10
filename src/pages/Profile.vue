<script>
import { getProfile } from '@/services/profile';
import ChangeNameForm from '@/components/profile/ChangeNameForm.vue';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue';
import AlertMessage from '@/components/utils/AlertMessage.vue';
import PostList from '@/components/profile/UserPostList.vue';

export default {
  name: "Profile",
  components: { ChangeNameForm, ChangePasswordForm, AlertMessage, PostList },
  data() {
    return {
      name: "",
      error: null,
    };
  },
  async mounted() {
    try {
      const user = await getProfile();
      this.name = user.user_metadata.name;
    } catch (e) {
      this.error = e.message;
    }
  },
}
</script>

<template>
  <h1 class="text-3xl mb-4">Perfil</h1>

  <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

  <section class="max-w-3xl flex gap-6">
    <ChangeNameForm :initial-name="name" />
    <ChangePasswordForm />
  </section>

  <section class="mt-5">
    <PostList />
  </section>

</template>