<script setup lang="ts">

const props = defineProps(['label', 'placeholder', 'type', 'modelValue'])
const emits = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex rounded-lg w-full h-3/4 items-center">
    <span v-if="props.label" class="mr-2">{{ props.label  }}</span>
    <input
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        @input="emits('update:modelValue', $event.target.value)"
        :class="props.label ? '' : 'w-full'"
        class="h-full pl-2 rounded-sm border-slate-300 border transition focus:ring-slate-300 focus:ring-2 bg-transparent outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
    />
    <slot></slot>
  </div>
</template>

<style scoped>

</style>