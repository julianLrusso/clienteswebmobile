<script>
import { login } from '@/services/auth';

export default {
  name: 'LoginForm',
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      loading: false,
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        const user = await login({
          email: this.user.email,
          password: this.user.password,
        })
        this.$emit('login', user);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
</script>

<template>
    <form action="#" @submit.prevent="handleSubmit">
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
    <button class="bg-indigo-800 border-indigo-900 text-amber-50 px-4 py-2 rounded-lg">Ingresar</button>
  </form>
</template>