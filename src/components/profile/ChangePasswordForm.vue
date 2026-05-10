<script>
import { updatePassword } from '@/services/auth';
import AlertMessage from '@/components/utils/AlertMessage.vue';

export default {
  name: "ChangePasswordForm",
  components: { AlertMessage },
  data() {
    return {
      password: "",
      alert: { text: "", colorClasses: "" },
    };
  },
  methods: {
    async handleUpdatePassword() {
      try {
        await updatePassword(this.password);
        this.alert = {
          text: "Contraseña actualizada con éxito.",
          colorClasses: "bg-green-100 border-green-600 text-green-800",
        };
        this.password = "";
      } catch (e) {
        this.alert = {
          text: e.message,
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
    },
  },
}
</script>

<template>
  <div class="min-w-150">
    <h2 class="text-xl mb-3">Cambiar contraseña</h2>
    <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" class="mb-3" />
    <form @submit.prevent="handleUpdatePassword" class="flex flex-col gap-3">
      <input
        v-model="password"
        type="password"
        class="w-full p-2 border-2 border-indigo-800 rounded"
        placeholder="Nueva contraseña"
      />
      <button class="bg-indigo-800 text-amber-50 px-4 py-2 rounded-lg">
        Guardar contraseña
      </button>
    </form>
  </div>
</template>