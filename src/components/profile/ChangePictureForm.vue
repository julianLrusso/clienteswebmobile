<script>
import AlertMessage from '@/components/utils/AlertMessage.vue';
import { updateCurrentUserPhoto } from '@/services/auth';

export default {
  name: "ChangePictureForm",
  components: { AlertMessage },
  data() {
    return {
      photo: {
        file: null,
        preview: null,
      },
      alert: { text: "", colorClasses: "" },
    };
  },
  methods: {
    async handlePhotoUpload() {
      try {
        await updateCurrentUserPhoto(this.photo.file);
        this.alert = {
          text: "Imagen de perfil actualizada con éxito.",
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

    handleFileChange(ev) {
      this.photo.file = ev.target.files[0];

      if(!this.photo.file) {
        if(this.photo.preview) URL.revokeObjectURL(this.photo.preview);
        this.photo.preview = null;
        return
      }

      this.photo.preview = URL.createObjectURL(this.photo.file);
    }
  },
  unmounted() {
    if(this.photo.preview) URL.revokeObjectURL(this.photo.preview);
  }
}
</script>

<template>
  <div class="min-w-150">
    <h2 class="text-xl mb-3">Cambiar imagen de perfil</h2>
    <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" class="mb-3" />
    <form @submit.prevent="handlePhotoUpload" class="flex gap-3">
      <div v-if="this.photo.preview !== null">
        <p class="sr-only">Previsualización de la imágen</p>
        <img 
          :src="this.photo.preview" 
          alt="Previsualiación de la imágen de perfil"
          class="max-w-full max-h-48"
        >
      </div>
      <div class="flex flex-col gap-3">
        <input
          type="file"
          id="photo"
          @change="handleFileChange"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-10"
        />
        <button class="bg-indigo-800 text-amber-50 px-4 py-2 rounded-lg">
          Guardar imagen de perfil
        </button>
      </div>
      
    </form>
  </div>
</template>