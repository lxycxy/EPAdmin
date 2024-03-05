<script setup lang="ts">
const props = defineProps(['customClass'])
</script>

<template>
<button
    :class="props.customClass"
    class="text-white rounded-xl hover:ring-1 hover:-translate-y-1 transition w-20 justify-around flex items-center">
  <slot></slot>
</button>
</template>

<style scoped>

</style>