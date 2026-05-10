<script>
import { register } from '@/services/auth';
import AlertMessage from '../utils/AlertMessage.vue';


export default {
  name: 'RegisterForm',
  components: { AlertMessage },
  data() {
    return {
        user: {
            email: '',
            password: '',
            name: '',
        },
        loading: false,
        alert: { 
            text: "", 
            colorClasses: "" 
        },
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        await register({
          email: this.user.email,
          name: this.user.name,
          password: this.user.password,
        })
        this.$router.push('/');
      } catch (e) {
        console.log(e);
        this.alert = {
          text: 'Ocurrió un error, por favor refresque la página e intente de nuevo.',
          colorClasses: "bg-red-100 border-red-600 text-red-800",
        };
      }
    }
  }
}

</script>

<template>
  <AlertMessage :text="alert.text" :color-classes="alert.colorClasses" />
  <form action="#" @submit.prevent="handleSubmit">
    <div class="mb-3">
        <label for="name" class="block mb-1">Nombre</label>
        <input v-model="user.name" 
        type="text"
        id="name"
        class="w-full p-2 border-2 border-indigo-800 rounded"
        >
    </div>
    <div class="mb-3">
        <label for="email" class="block mb-1">Email</label>
        <input v-model="user.email" 
        type="email" 
        id="email" 
        class="w-full p-2 border-2 border-indigo-800 rounded"
        >
    </div>
    <div class="mb-3">
        <label for="password" class="block mb-1">Contraseña</label>
        <input v-model="user.password" 
        type="password" 
        id="password" 
        class="w-full p-2 border-2 border-indigo-800 rounded"
        >
    </div>
    <button class="bg-indigo-800 border-indigo-900 text-amber-50 px-4 py-2 rounded-lg">Crear cuenta</button>
  </form>
</template>

<style scoped></style>
