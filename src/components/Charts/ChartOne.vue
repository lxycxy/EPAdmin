<script setup lang="ts">
import { computed, ref } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'
import * as chartApi from '@/api/dashboard'

const chartDataNum = ref([])
const getChartData = () => {
  chartApi.getChartOne()
    .then(resp => {
      chartDataNum.value = resp.data.buildingProcess
    })
}
getChartData();

const chartData = computed(() => ({
  series: [
    {
      name: '数量',
      data: chartDataNum.value
    },
  ],
  labels: ['未开始', '进行中', '已延期', '已竣工']
}));

const chart = ref(null)

const apexOptions = {
  colors: ['#3056D3'],
  chart: {
    type: 'bar',
    height: 335,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%'
          }
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last'
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category',
    categories: chartData.value.labels
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99
    }
  },
  fill: {
    opacity: 1
  }
}
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6"
  >
    <div class="mb-4 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-sm font-bold text-black dark:text-white">
            项目整体建设进度
        </h4>
      </div>
    </div>

    <div>
      <div id="chartTwo" class="-ml-5 -mb-9">
        <VueApexCharts
          type="bar"
          height="250"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
  </div>
</template>
