<script>
export default {
  name: "AlertMessage",
  props: {
    text: {
      type: String,
      required: true,
    },
    colorClasses: {
      type: String,
      default: "bg-green-100 border-green-600 text-green-800",
    },
  },
}
</script>

<template>
  <div
    v-if="text"
    :class="['border-l-4 px-4 py-3 rounded', colorClasses]"
    role="alert"
  >
    {{ text }}
  </div>
</template>