<script setup lang="ts">
import ProfileCard from '@/components/ProfileCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { ref } from 'vue';

const pageTitle = ref('个人信息')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-242.5">

      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <ProfileCard />
    </div>
  </DefaultLayout>
</template>
