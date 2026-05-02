<script>
import supabase from '@/services/supabase';

  export default {
    name: "Posts",
    data() {
      return {
        messages: [],

        newMessage: {
          body: "",
          name: "",
        },

      };
    },
    methods: {
      sendMessages() {
        this.messages.push({
          id: this.messages.length,
          name: this.newMessage.name,
          body: this.newMessage.body,
          created_at: new Date(),
        });
        this.newMessage.body = '';
      },
    },
    async mounted() {
      const {data, error} = await supabase.from('public_posts').select();
      this.messages = data;
    }
  }
</script>

<template>
  <h1 class="text-3xl mb-4">Publicaciones</h1>
  <div class="flex gap-4">
    <section class="w-full border-2 border-indigo-900 rounded h-min-100 bg-mist-300">

      <h2 class="sr-only">Listado de publicaciones</h2>

      <ol class="p-2">

        <li v-for="message in messages"
          :key="message.id" 
          class="p-2 border-2 border-indigo-800 m-2 rounded-lg bg-mist-200"
         >
          <div><b>{{ message.name }}</b>:</div>
          <div>{{ message.body }}</div>
          <div class="text-sm text-mist-600">Enviado el {{ message.created_at }}</div>
        </li>

      </ol>

    </section>
    <section>
      <form action="#"
        @submit.prevent="sendMessages"
      >

        <div class="mb-3">
          <label for="name" class="block mb-1">Nombre</label>
          <input v-model="newMessage.name" 
          type="text" 
          id="name" 
          class="w-full p-2 border-2 border-indigo-800 rounded"
          >
        </div>

        <div class="mb-3">
          <label for="message" class="block mb-1">Mensaje</label>
          <textarea v-model="newMessage.body" 
            id="message" 
            class="w-full p-2 border-2 border-indigo-800 rounded"
          ></textarea>
        </div>

        <button class="bg-indigo-800 border-indigo-900 text-amber-50 px-4 py-2 rounded-lg">
          Publicar
        </button>

      </form>
    </section>
  </div>
</template>

<style scoped></style>
