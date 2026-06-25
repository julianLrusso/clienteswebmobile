<script>
import { subscribeToAuthStateChanges } from '@/services/auth';
import ChangeNameForm from '@/components/profile/ChangeNameForm.vue';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue';
import AlertMessage from '@/components/utils/AlertMessage.vue';
import ChangeBioForm from '@/components/profile/ChangeBioForm.vue';
import ChangePictureForm from '@/components/profile/ChangePictureForm.vue';

export default {
  name: "Profile",
  components: { ChangeNameForm, ChangePasswordForm, AlertMessage, ChangeBioForm, ChangePictureForm },
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
  <h1 class="text-3xl mb-4">Editar perfil</h1>

  <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

  <section>
    <div class="flex flex-wrap gap-4 p-2">
      <ChangeNameForm :initial-name="user.name" />
      <ChangePasswordForm />
      <ChangeBioForm :initial-bio="user.bio"/>
      <ChangePictureForm />
    </div>
    
  </section>

</template>