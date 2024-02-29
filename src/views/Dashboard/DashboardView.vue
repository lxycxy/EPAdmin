<script setup lang="ts">
import DataStatsOne from '@/components/DataStats/DataStatsOne.vue'
import DataStatsTwo from '@/components/DataStats/DataStatsTwo.vue'
import DataStatsThree from '@/components/DataStats/DataStatsThree.vue'
import ChartOne from '@/components/Charts/Chart-one.vue'
import ChartTwo from '@/components/Charts/Chart-two.vue'
import ChartThree from '@/components/Charts/Chart-three.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-6 2xl:gap-5.5">
      <DataStatsOne />
    </div>

    <div class="mt-4 grid grid-cols-12 gap-2 md:mt-6 md:gap-4 2xl:mt-7.5 2xl:gap-5.5">
      <DataStatsTwo />

      <DataStatsThree />
    </div>

    <div class="mt-4 grid grid-cols-12 gap-2 md:mt-6 md:gap-4 2xl:mt-7.5 2xl:gap-5.5">
      <ChartOne />

      <ChartTwo />

      <ChartThree />
    </div>
  </DefaultLayout>
</template>
