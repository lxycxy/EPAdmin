<script setup lang="ts">
import { computed, ref } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'
import * as chartApi from '@/api/dashboard'

const chartDataNum = ref([])
const getChartData = () => {
  chartApi.getChartTwo()
    .then(resp => {
      chartDataNum.value = resp.data.buildingPhaseRatio
    })
}
getChartData();

const chartData = computed(() => ({
  series: chartDataNum.value,
  labels: ['方案设计阶段','基层处理阶段','面层处理阶段','深层处理阶段','项目验收阶段','项目收尾阶段']
}))

const chart = ref(null)

const apexOptions = {
  chart: {
    type: 'donut',
    width: 380
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#4ACDCF', '#9268FF'],
  labels: chartData.value.labels,
  legend: {
    show: false,
    position: 'bottom'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200
        }
      }
    }
  ]
}
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-3"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-sm font-bold text-black dark:text-white">项目当前阶段情况</h4>
      </div>
    </div>
    <div class="mb-2">
      <div id="chartTwo" class="mx-auto flex justify-center">
        <VueApexCharts
          type="donut"
          width="250"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
    <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 方案设计阶段 </span>
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 基层处理阶段 </span>
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 面层处理阶段 </span>
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 深层处理阶段 </span>
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#4ACDCF]"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 项目验收阶段 </span>
          </p>
        </div>
      </div>
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#9268FF]"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 项目收尾阶段 </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
