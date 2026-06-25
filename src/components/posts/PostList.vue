<script>
import { getAllPosts, subscribeToPosts } from '@/services/posts';
import AlertMessage from '../utils/AlertMessage.vue';
import { formatDate } from '@/helpers/date.js';

let unsubscribeFromPosts = () => {};
export default {
  name: "PostList",
  components: { AlertMessage },
  data() {
    return {
      messages: [],
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
    formatDate,
  },
  async mounted() {
    unsubscribeFromPosts = subscribeToPosts(newPosts => this.messages.unshift(newPosts));
    try {
      this.messages = await getAllPosts();
    } catch (e) {
        console.log(e);
        this.alert = {
            text: 'Ocurrió un error, por favor refresque la página.',
            colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
    }
    
  },
  unmounted() {
    unsubscribeFromPosts();
  },
}
</script>

<template>
    <section :class="sectionClasses">
        <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" />

        <h2 class="sr-only">Listado de publicaciones</h2>

        <ol class="p-2">

        <li v-for="message in messages"
            :key="message.id" 
            class="p-2 border-2 border-indigo-800 m-2 rounded-lg bg-mist-200"
            >
            <RouterLink :to="`usuario/${message.user_id}`"><b class="hover:text-indigo-800">{{ message.name }}</b>:</RouterLink>
            <div>{{ message.body }}</div>
            <div class="text-sm text-mist-600">Enviado el {{this.formatDate( message.created_at )}}</div>
        </li>

        </ol>

    </section>
</template>

<style scoped></style>
