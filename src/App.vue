<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <transition name="fade" mode="out-in">
    <RouterView />
  </transition>
</template>
