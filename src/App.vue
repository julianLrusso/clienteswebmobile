<script></script>

<template>
  <nav class="flex items-center gap-8 p-4 bg-indigo-950 text-amber-50">
    <RouterLink class="text-xl" to="/">Jueguitos</RouterLink>
    <ul class="flex gap-8">
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/publicaciones">Publicaciones</RouterLink>
      </li>
      <li>
        <RouterLink to="/ingresar">Ingresar</RouterLink>
      </li>
      <li>
        <RouterLink to="/registrarse">Registrarse</RouterLink>
      </li>
    </ul>
  </nav>

  <main class="container p-4 mx-auto">
    <Router-View></Router-View>
  </main>
   
  <footer class="flex justify-center bg-indigo-950 text-amber-50 p-6">Julián López Russo - TP1 - Clientes Web Mobile - 2026</footer>
</template>

<style scoped></style>
