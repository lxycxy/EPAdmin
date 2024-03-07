<script setup lang="ts">

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EButton from "@/components/Buttons/EButton.vue";
import LeftIcon from "@/components/Icons/LeftIcon.vue";
import router from "@/router";
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col items-center justify-center">
      <img class="w-80" src="@/assets/images/illustration/illustration-01.svg" />
      <span class="text-black m-5 dark:text-white font-bold text-2xl">您的权限不足</span>
      <EButton @click="router.back()" class="bg-sky-400 m-5 ring-sky-400 w-36 h-12">
        <LeftIcon class="w-5 h-5"></LeftIcon>
        返回上一页
      </EButton>
    </div>
  </DefaultLayout>
</template>

<style scoped>

</style>