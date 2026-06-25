<script>
import { updateCurrentUserProfile } from '@/services/auth';
import AlertMessage from '@/components/utils/AlertMessage.vue';

export default {
  name: "ChangeBioForm",
  components: { AlertMessage },
  props: {
    initialBio: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bio: this.initialBio,
      alert: { text: "", colorClasses: "" },
    };
  },
  methods: {
    async handleUpdateBio() {
      try {
        await updateCurrentUserProfile({bio: this.bio});
        this.alert = {
          text: "Biografía actualizada con éxito.",
          colorClasses: "bg-green-100 border-green-600 text-green-800",
        };
      } catch (e) {
        this.alert = {
          text: e.message,
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
    },
  },
  watch: {
    initialBio: {
      immediate: true,
      handler(newVal) {
        this.bio = newVal;
      },
    },
  },
}
</script>

<template>
  <div class="min-w-150">
    <h2 class="text-xl mb-3">Cambiar Biografía</h2>
    <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" class="mb-3" />
    <form @submit.prevent="handleUpdateBio" class="flex flex-col gap-3">
      <input
        v-model="bio"
        type="text"
        class="w-full p-2 border-2 border-indigo-800 rounded"
        placeholder="Biografía"
      />
      <button class="bg-indigo-800 text-amber-50 px-4 py-2 rounded-lg">
        Guardar Biografía
      </button>
    </form>
  </div>
</template>