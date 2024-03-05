<script setup lang="ts">
const props = defineProps(['options', 'modelValue'])

const emits = defineEmits(['update:modelValue'])

</script>

<template>
  <div>
    <select @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" class="w-full h-full p-1.5 outline-none border-slate-200 focus:border-[1px] focus:border-primary">
      <option value="" class="hidden" selected>请选择</option>
      <option v-for="item in props.options" :value="item.value">
        {{item.label}}
      </option>
      <slot></slot>
    </select>
  </div>
</template>
