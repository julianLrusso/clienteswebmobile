<script>
import { getAllPosts, subscribeToPosts, editPost, deletePost } from '@/services/posts';
import { subscribeToAuthStateChanges } from '@/services/auth';
import { getUserProfileById } from '@/services/profile';
import AlertMessage from '../utils/AlertMessage.vue';
import { formatDate } from '@/helpers/date.js';

let unsubscribeFromPosts = () => {};
export default {
  name: "PostList",
  components: { AlertMessage },
  data() {
    return {
      messages: [],
      user: {
        id: null,
        email: null,
        name: null,
      },
      editingId: null,
      editingBody: "",
      deletingId: null,
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
    startEdit(message) {
      this.editingId = message.id;
      this.editingBody = message.body;
      this.deletingId = null;
    },
    cancelEdit() {
      this.editingId = null;
      this.editingBody = "";
    },
    async saveEdit(id) {
      if (!this.editingBody.trim()) {
        this.alert = {
          text: "El cuerpo del mensaje no puede estar vacío.",
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
        return;
      }
      try {
        await editPost(id, { body: this.editingBody });
        this.editingId = null;
        this.editingBody = "";
        this.alert = {
          text: "Mensaje editado con éxito.",
          colorClasses: "bg-green-100 border-green-600 text-green-800",
        };
      } catch (e) {
        console.error(e);
        this.alert = {
          text: "Error al editar el mensaje. " + e.message,
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
    },
    async confirmDelete(id) {
      try {
        await deletePost(id);
        this.deletingId = null;
        this.alert = {
          text: "Mensaje eliminado con éxito.",
          colorClasses: "bg-green-100 border-green-600 text-green-800",
        };
      } catch (e) {
        console.error(e);
        this.alert = {
          text: "Error al eliminar el mensaje. " + e.message,
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
    }
  },
  async mounted() {
    subscribeToAuthStateChanges(newUserData => this.user = newUserData);

    unsubscribeFromPosts = subscribeToPosts(async (payload) => {
      if (payload.eventType === 'INSERT') {
        const newPost = payload.new;
        try {
          const profile = await getUserProfileById(newPost.user_id);
          newPost.name = profile.name;
        } catch (error) {
          console.error("Error al obtener perfil para post en tiempo real:", error);
          newPost.name = 'Usuario';
        }
        if (!this.messages.some(message => message.id === newPost.id)) {
          this.messages.unshift(newPost);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedPost = payload.new;
        const index = this.messages.findIndex(message => message.id === updatedPost.id);
        if (index !== -1) {
          this.messages[index].body = updatedPost.body;
        }
      } else if (payload.eventType === 'DELETE') {
        const deletedPost = payload.old;
        this.messages = this.messages.filter(message => message.id !== deletedPost.id);
      }
    });

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
            <div class="flex justify-between items-start gap-4">
              <div class="grow">
                <RouterLink :to="`usuario/${message.user_id}`">
                  <b class="hover:text-indigo-800">{{ message.name || 'Usuario' }}</b>:
                </RouterLink>
                
                <div v-if="editingId === message.id" class="mt-2 mb-2">
                  <textarea 
                    v-model="editingBody" 
                    class="w-full p-2 border-2 border-indigo-800 rounded bg-amber-50/50 focus:outline-none focus:border-indigo-600 text-neutral-900"
                    rows="2"
                  ></textarea>
                  <div class="flex gap-2 mt-1">
                    <button 
                      @click="saveEdit(message.id)" 
                      class="bg-green-800 hover:bg-green-900 text-amber-50 px-2 py-1 text-xs rounded border border-green-900 cursor-pointer font-medium transition-colors"
                    >
                      Guardar
                    </button>
                    <button 
                      @click="cancelEdit" 
                      class="bg-neutral-600 hover:bg-neutral-700 text-amber-50 px-2 py-1 text-xs rounded border border-neutral-700 cursor-pointer font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
                <div v-else class="my-1 whitespace-pre-wrap text-neutral-900">{{ message.body }}</div>
                
                <div class="text-xs text-mist-600 mt-1">Enviado el {{ formatDate(message.created_at) }}</div>
              </div>

              <!-- Acciones del post (editar / eliminar) -->
              <div v-if="user && user.id === message.user_id && editingId !== message.id" class="flex items-center gap-2 shrink-0 self-start mt-0.5">
                <button 
                  @click="startEdit(message)" 
                  class="text-indigo-800 hover:text-indigo-950 hover:underline text-xs font-semibold cursor-pointer transition-colors"
                >
                  Editar
                </button>
                
                <template v-if="deletingId === message.id">
                  <span class="text-xs text-red-700 font-semibold">¿Seguro?</span>
                  <button 
                    @click="confirmDelete(message.id)" 
                    class="text-red-700 hover:text-red-950 hover:underline text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Sí
                  </button>
                  <button 
                    @click="deletingId = null" 
                    class="text-neutral-600 hover:text-neutral-800 hover:underline text-xs font-semibold cursor-pointer transition-colors"
                  >
                    No
                  </button>
                </template>
                <button 
                  v-else 
                  @click="deletingId = message.id" 
                  class="text-red-700 hover:text-red-950 hover:underline text-xs font-semibold cursor-pointer transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
        </li>

        </ol>

    </section>
</template>

<style scoped></style>
