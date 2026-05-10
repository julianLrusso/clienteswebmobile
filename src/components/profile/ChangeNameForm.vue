<script>
import { updateName } from '@/services/auth';
import AlertMessage from '@/components/utils/AlertMessage.vue';

export default {
  name: "ChangeNameForm",
  components: { AlertMessage },
  props: {
    initialName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      name: this.initialName,
      alert: { text: "", colorClasses: "" },
    };
  },
  methods: {
    async handleUpdateName() {
      try {
        await updateName(this.name);
        this.alert = {
          text: "Nombre actualizado con éxito.",
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
}
</script>

<template>
  <div class="min-w-150">
    <h2 class="text-xl mb-3">Cambiar nombre</h2>
    <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" class="mb-3" />
    <form @submit.prevent="handleUpdateName" class="flex flex-col gap-3">
      <input
        v-model="name"
        type="text"
        class="w-full p-2 border-2 border-indigo-800 rounded"
        placeholder="Nombre"
      />
      <button class="bg-indigo-800 text-amber-50 px-4 py-2 rounded-lg">
        Guardar nombre
      </button>
    </form>
  </div>
</template>