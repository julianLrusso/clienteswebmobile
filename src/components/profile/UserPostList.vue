<script>
import { getPostsByUser } from '@/services/posts';
import AlertMessage from '@/components/utils/AlertMessage.vue';

export default {
  name: "UserPostList",
  components: { AlertMessage },
  props: {
    user_id: String,
  },
  data() {
    return {
      posts: [],
      error: null,
    };
  },
  async mounted() {
    try {
      this.posts = await getPostsByUser({userId: this.user_id});
    } catch (e) {
      this.error = e.message;
    }
  },
}
</script>

<template>

    <AlertMessage v-if="error" :text="error" color-classes="bg-red-100 border-red-600 text-red-800" class="mb-4" />

    <h2 class="text-xl mb-3">Mis publicaciones</h2>
    <ol class="flex flex-col gap-2">
        <li v-for="post in posts" :key="post.id"
        class="p-2 border-2 border-indigo-800 rounded-lg bg-mist-200"
        >
        <div>{{ post.body }}</div>
        <div class="text-sm text-mist-600">{{ post.created_at }}</div>
        </li>
    </ol>
    <p v-if="posts.length === 0" class="text-mist-600">No tenés publicaciones aún.</p>

</template>