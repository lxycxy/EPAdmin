<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput.vue"

const statusOptions = [
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  }
]
const natureOptions = [
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  }
]

const searchConditions = ref({
  name: '',
  id: '',
  status: '',
  nature: ''
})

const pageTitle = ref('合同台账')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-400">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      
      <!-- 搜索框 -->
      <div class="rounded-2xl bg-white dark:bg-boxdark flex items-center flex-wrap">
        <SearchInput class="text-xs max-w-100" label="合同名称" placeholder="输入合同名称" v-model="searchConditions.name" ></SearchInput>     
        <SearchInput class="text-xs max-w-100" label="合同编号" placeholder="输入合同编号" v-model="searchConditions.id"></SearchInput>  
        
        <div class="flex items-center">
          <p class="text-xs ml-3">合同状态</p>
          <el-select v-model="searchConditions.status" class="m-2 max-w-100" placeholder="" style="width: 150px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">合同性质</p>
          <el-select v-model="searchConditions.nature" class="m-2 max-w-100" placeholder="" style="width: 150px">
            <el-option v-for="item in natureOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-15 p-1.5 text-xs ml-auto m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
            <path fill="#ffffff"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          查询
        </button>

        <button
          class="flex justify-around justify-end items-center bg-meta-3 text-white rounded-lg w-15 p-1.5 text-xs m-2 hover:ring-1 hover:ring-meta-3 hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
            <path fill="#ffffff"
              d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
          </svg>
          重置
        </button>
      </div>

      <!-- 操作区 -->
      <div class="flex items-center flex-wrap mt-2">
        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          新增
        </button>

        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
            <path 
              fill="#ffffff" 
              d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
          </svg>
          审核
        </button>

        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
            <path d="m12 18 4-5h-3V2h-2v11H8z">
            </path>
            <path
              d="M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z">
            </path>
          </svg>
          导入
        </button>

        <button
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-white">
            <path d="M11 16h2V7h3l-4-5-4 5h3z">
            </path>
            <path
              d="M5 22h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2z">
            </path>
          </svg>
          导出
        </button>
      </div>

      <div class="max-h-400 overflow-y-auto">
        <!-- 表格 -->
        <table class="mt-2 w-full table-wrapper rounded-lg">
          <!-- 表头 -->
          <thead>
            <tr class="bg-slate-300 text-center dark:bg-meta-4">
              <th class="text-xs min-w-[50px] py-1 px-2 font-medium text-black dark:text-white">
                序号
              </th>
              <th class="text-xs min-w-[200px] py-1 px-2 font-medium text-black dark:text-white">
                项目名称
              </th>
              <th class="text-xs font-normal min-w-[100px] py-1 px-2 font-medium text-black dark:text-white">
                项目金额(万元)
              </th>
              <th class="text-xs min-w-[100px] py-2 px-2 font-medium text-black dark:text-white">
                状态
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                当前阶段
              </th>
              <th class="text-xs min-w-[70px] py-3 px-2 font-medium text-black dark:text-white">
                进度预警
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                项目进度
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                项目所在地
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                计划开工时间
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                实际开工时间
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                操作
              </th>
            </tr>
          </thead>

          <!-- 表格内容 -->
          <tbody>
            
          </tbody>
        </table>
      </div>

      <!-- 无数据显示 -->
      

      <!-- 分页 -->
      

    </div>
  </DefaultLayout>
</template>
