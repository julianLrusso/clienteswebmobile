<script>
import NewPostForm from '@/components/posts/NewPostForm.vue';
import PostList from '@/components/posts/PostList.vue';

export default {
  name: "Posts",
  components: {NewPostForm, PostList},
}
</script>

<template>
  <h1 class="text-3xl mb-4">Publicaciones</h1>
  <div class="gap-4">
    <NewPostForm section-classes="mb-5" />
    <PostList section-classes="w-full border-2 border-indigo-900 rounded min-h-100 bg-mist-300 max-h-150 overflow-y-auto" />
  </div>
</template>

<style scoped></style>
