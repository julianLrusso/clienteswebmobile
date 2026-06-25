<script>
import { sendPosts } from '@/services/posts';
import AlertMessage from '../utils/AlertMessage.vue';

export default {
  name: "NewPostForm",
  components: { AlertMessage },
  data() {
    return {
        newMessage: {
            body: "",
        },
        user: {
            id: "",
            name: "",
            email: "",
        },
        alert: { 
            text: "", 
            colorClasses: "" 
        },
        };
  },
  props: {
    sectionClasses: String,
  },
  methods: {
    async sendMessages() {
      try {
        const response = await sendPosts({body: this.newMessage.body});
        this.alert = {
          text: response.message,
          colorClasses: "bg-green-100 border-green-600 text-green-800",
        };
      } catch (e) {
        console.log(e);
        this.alert = {
          text: 'Ocurrió un error, por favor intente de nuevo.',
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
      this.newMessage.body = '';
    },
  },
}
</script>

<template>
    <section :class="sectionClasses">
      <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" />
      <h2 class="sr-only">Enviar mensaje</h2>
      <form action="#"
        @submit.prevent="sendMessages"
        class="max-w-150 mx-auto"
      >

        <div class="mb-3">
          <label for="message" class="block mb-1">Mensaje</label>
          <textarea v-model="newMessage.body" 
            id="message"
            class="w-full p-2 border-2 border-indigo-800 rounded"
          ></textarea>
        </div>

        <button class="bg-indigo-800 border-indigo-900 text-amber-50 px-4 py-2 rounded-lg w-full">
          Publicar
        </button>

      </form>
    </section>
</template>