<script setup lang="ts">
const porps = defineProps(['label', 'placeholder', 'type'])

</script>

<template>
  <div class="flex rounded-lg p-3 items-center">
    <span class="mr-2">{{ porps.label }}</span>
    <input
        :type="porps.type"
        :placeholder="porps.placeholder"
        class="rounded-sm border-slate-300 border transition focus:ring-slate-300 focus:ring-2 bg-transparent py-2 pl-3 pr-10 outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
    />
    <slot></slot>
  </div>
</template>

<style scoped>

</style>