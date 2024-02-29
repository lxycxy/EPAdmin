<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

const chartData = {
  series: [60], // 占比百分比，这里是示例数据
  labels: ['超期项目'] // 如果需要，可以设置您的标签
}

const chart = ref(null)

const apexOptions = {
  chart: {
    type: 'donut',
    width: 380
  },
  colors: ['#3C50E0'],
  labels: chartData.labels,
  plotOptions: {
    radialBar: {
      hollow: {
        size: '60%',
      },
      dataLabels: {
        name: {
          text: 'dsjakdjalk',
          show: true,
          fontSize: '22px',
        },
        value: {
          show: true,
          fontSize: '16px',
        },
        total: {
          show: false,
        }
      }
    }
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
        <h4 class="text-sm font-bold text-black dark:text-white">超期项目占比</h4>
      </div>
    </div>
    <div class="mb-2">
      <div id="chartThree" class="mx-auto flex justify-center">
        <VueApexCharts
          type="radialBar"
          width="350"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
    <!-- 这里是项目分类描述 -->
    <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
      <div class="w-full px-4 sm:w-1/2">
        <div class="flex w-full items-center">
          <span class="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
          <p class="flex w-full justify-between text-xs font-medium text-black dark:text-white">
            <span> 超期项目 </span>
          </p>
        </div>
      </div>
      <!-- 其他项目描述 -->
    </div>
  </div>
</template>