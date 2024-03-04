<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput.vue";
import Pagination from "@/components/Buttons/Pagination.vue";

const tableData = ref([
  {
    name: '厦门翔安新机场片区地下综合管廊PPP项目',
    cost: '86360.14',
    status: '前期',
    currentStage: '方案设计',
    warning: 0,
    progress: 80,
    site: '厦门，翔安',
    planTime: '2016-06-30',
    realTime: '2016-06-30'
  },
  {
    name: '厦门翔安新机场片区地下综合管廊PPP项目',
    cost: '86360.14',
    status: '前期',
    currentStage: '方案设计',
    warning: 0,
    progress: 35,
    site: '厦门，翔安',
    planTime: '2016-06-30',
    realTime: '2016-06-30'
  },
  {
    name: '厦门翔安新机场片区地下综合管廊PPP项目',
    cost: '86360.14',
    status: '前期',
    currentStage: '方案设计',
    warning: 1,
    progress: 70,
    site: '厦门，翔安',
    planTime: '2016-06-30',
    realTime: '2016-06-30'
  },
  {
    name: '厦门翔安新机场片区地下综合管廊PPP项目',
    cost: '86360.14',
    status: '前期',
    currentStage: '方案设计',
    warning: 1,
    progress: 100,
    site: '厦门，翔安',
    planTime: '2016-06-30',
    realTime: '2016-06-30'
  },
  {
    name: '厦门翔安新机场片区地下综合管廊PPP项目',
    cost: '86360.14',
    status: '前期',
    currentStage: '方案设计',
    warning: 2,
    progress: 30,
    site: '厦门，翔安',
    planTime: '2016-06-30',
    realTime: '2016-06-30'
  },
])

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
]

const addDialogVisible = ref(false)

const addProject = () => {
  addDialogVisible.value = true;
}

const value1 = ref('')

const textarea = ref('')

const handlePageChange = (currentPage: number) => {
  console.log(currentPage);
}

const pageTitle = ref('项目库')
</script>

<template>
  <DefaultLayout>
    <!-- 新增项目对话框 -->
    <el-dialog v-model="addDialogVisible" title="新建项目" width="800" align-center class="p-10">
      <div class="rounded-lg px-6">
        <p>基本信息</p>

        <!-- 填报内容 -->
        <div class="grid grid-cols-12 mt-5">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">吊毛</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">当前阶段</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="value" class="w-full text-xs" placeholder="选择当前状态" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目状态</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="value" class="w-full text-xs" placeholder="选择当前状态" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目进度(%)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目所在地</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="value" class="w-full text-xs" placeholder="选择当前状态" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">计划开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="value1" type="date" placeholder="Pick a day" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">计划完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="value1" type="date" placeholder="Pick a day" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际开工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="value1" type="date" placeholder="Pick a day" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">实际完工时间</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="value1" type="date" placeholder="Pick a day" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">附件</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input class="text-xs " type="file" id="fileInput" name="fileInput" accept=".pdf, .doc, .docx" multiple />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">项目负责人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">联系电话</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-20 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">联系电话</span>
          </div>
          <div class="col-span-10 flex items-center h-20 px-2 border border-slate-300">
            <el-input
              v-model="textarea"
              resize="none"
              type="textarea"
              placeholder="Please input"
              maxlength="200"
              show-word-limit
            />
          </div>


        </div>
      </div>

    </el-dialog>


    <div class="mx-auto max-w-400">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- 搜索框 -->
      <div class="rounded-2xl bg-white dark:bg-boxdark flex items-center flex-wrap">
        <SearchInput class="text-xs max-w-100" label="项目名称" placeholder="输入项目名称"></SearchInput>

        <div class="flex items-center">
          <p class="text-xs ml-3">项目状态</p>
          <el-select v-model="value" class="m-2 max-w-100" placeholder="选择项目状态" style="width: 150px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">当前状态</p>
          <el-select v-model="value" class="m-2 max-w-60" placeholder="选择当前状态" style="width: 150px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">所在区域</p>
          <el-select v-model="value" class="m-2 max-w-60" placeholder="选择所在区域" style="width: 150px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
        <button @click="addProject()"
          class="flex justify-around items-center bg-primary text-white rounded-lg w-16 p-1.5 text-xs m-2 hover:ring-1 hover:ring-primary hover:-translate-y-1 transition ring-primary">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
          新增
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
            <tr class="bg-white dark:bg-slate-300 items-center" v-for="(item, index) in tableData" :key="index">
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ index + 1 }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.name }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.cost }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.status }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.currentStage }}</p>
              </td>
              <td class="flex justify-center items-center text-center py-2 px-2">
                <div v-if="item.warning === 0" class="rounded-full bg-green-500 w-8 h-8" style="transform: scale(0.8);">
                </div>
                <div v-if="item.warning === 1" class="rounded-full bg-yellow-300 w-8 h-8"
                  style="transform: scale(0.8);"></div>
                <div v-if="item.warning === 2" class="rounded-full bg-red w-8 h-8" style="transform: scale(0.8);"></div>
              </td>
              <td class="text-center py-2 px-2">
                <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" />
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.site }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.planTime }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.realTime }}</p>
              </td>
              <td class="flex-between text-center py-2 px-2">
                <span class="text-xs text-primary underline"> 编辑 </span>
                <span class="ml-1 text-xs text-primary underline"> 删除 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 无数据显示 -->
      <div v-if="tableData.length === 0"
        class="h-48 border-t flex items-center justify-center border-slate-300 text-2xl font-bold bg-slate-200 w-full">
        暂无数据
      </div>

      <!-- 分页 -->
      <Pagination class="h-12 text-xs" @pageChange="handlePageChange" pageCount="1" total="1"></Pagination>
    </div>
  </DefaultLayout>

</template>

<style scoped>
  
</style>