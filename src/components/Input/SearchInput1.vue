<script setup lang="ts">

const props = defineProps(['label', 'placeholder', 'type', 'modelValue'])
const emits = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex rounded-lg p-2.5 items-center">
    <span class="mr-2">{{ props.label  }}</span>
    <input
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        @input="emits('update:modelValue', $event.target.value)"
        class="w-2/3 rounded-sm border-slate-300 border transition focus:ring-slate-300 focus:ring-2 bg-transparent py-2 pl-3 pr-10 outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
    />
    <slot></slot>
  </div>
</template>

<style scoped>

</style>