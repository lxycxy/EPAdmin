<script setup lang="ts">
import { reactive, ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SearchInput from "@/components/Input/SearchInput.vue"
import Pagination from "@/components/Buttons/Pagination.vue"
import type { PaginationInfo } from "@/utils/Pagination";
import type { ContractData } from "@/api/contract"
import * as contractApi from "@/api/contract"

const statusOptions = [
  "审核中",
  "履行中",
  "已完成",
  
]
const natureOptions = [
  "收入合同",
  "支出合同"
]
const projectOptions = ref([])
const typeOptions = [
  "勘察设计合同",
  "设计合同",
  "监理合同",
  "施工合同",
  "设计和材料采购合同",
  "招标代理合同",
  "工程咨询合同",
  "运输合同",
  "担保合同",
  "保险合同",
]
const payOptions = [
  "按月结算",
  "竣工后一次结算",
  "分段结算",
  "目标结算结算方式",
  "其他结算",
]
const wayOptions = [
  "招标",
  "委托"
]

const originData = ref<ContractData[]>([])
const tableData = ref<ContractData[]>([])
let detailData: ContractData = reactive({}) as ContractData

let pageInfo: PaginationInfo = reactive({}) as PaginationInfo

const getContractData = () => {
  contractApi.getContractData()
    .then(resp => {
      originData.value = resp.data

      pageInfo.totalCount = originData.value.length;
      pageInfo.pageSize = 6;
      pageInfo.totalPages = Math.ceil(pageInfo.totalCount / pageInfo.pageSize);
      pageInfo.currentPage = 1;
      tableData.value = [...originData.value]
        .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
    })
    .catch(resp => {
      console.log(resp)
    })
}
getContractData();

const handlePageChange = (currentPage: number) => {
  pageInfo.currentPage = currentPage;
  tableData.value = [...originData.value]
    .slice((pageInfo.currentPage - 1) * pageInfo.pageSize, pageInfo.currentPage * pageInfo.pageSize)
}

let flag = ref() /* 判断addDialog窗口标题 */
const addDialogVisible = ref(false)
const addContractDialog = () => {
  flag.value = true;
  addDialogVisible.value = true;
}
const editContractDialog = (item: ContractData) => {
  flag.value = false;
  addDialogVisible.value = true;
  detailData = {...item};
}
const closeAddContractDialog = () => {
  addDialogVisible.value = false;
  detailData = reactive({}) as ContractData
}

const detailDialogVisible = ref(false);
const showDetail = (item: ContractData) => {
  detailDialogVisible.value = true;
  detailData = {...item}
}

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
    <!-- 填写合同对话框 -->
    <el-dialog v-model="addDialogVisible" :title="flag ? '新建合同' : '审核合同'" width="800" align-center class="p-10" @close="closeAddContractDialog">
      <div class="rounded-lg px-6">
        <!-- 填报内容 -->
        <div class="grid grid-cols-12">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.projectId" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                :value="item.projectId" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同类型</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.contractType" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in typeOptions" :key="item" :label="item"
                :value="item" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">合同编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractId"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">合同名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractName"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同性质</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.contractNature" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in natureOptions" :key="item" :label="item"
                :value="item" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">结算方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.contractPay" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in payOptions" :key="item" :label="item"
                :value="item" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">合同金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractCost"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">预付款(%)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="number"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractPrepaid"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">签约日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.contractSigndate" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">开始日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.contractStartdate" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">结束日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-date-picker v-model="detailData.contractEnddate" type="date" placeholder="" size="small" />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">签订方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <el-select v-model="detailData.contractWay" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in wayOptions" :key="item" :label="item"
                :value="item" />
            </el-select>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">甲方单位</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractFirstcompany"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">乙方单位</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.contractSecondcompany"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">甲方负责人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.firstcompanyManager"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">联系方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.firstcompanyManagerPhone"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">乙方负责人</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.secondcompanyManager"
              />
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">联系方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <input type="text"
              class="w-full h-2/3 border-[0.5px] text-black border-stroke bg-transparent py-3 px-2 text-xs outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter" 
              v-model="detailData.secondcompanyManagerPhone"
              />
          </div>

          <div v-if="!flag" class="col-start-4 col-end-6 w-full h-10 flex justify-end items-center px-2">
            <span class="text-xs">合同状态</span>
          </div>
          <div v-if="!flag" class="col-span-3 flex items-center h-10 px-2">
            <el-select v-model="detailData.contractState" class="w-full text-xs" placeholder="" size="small">
              <el-option v-for="item in statusOptions" :key="item" :label="item"
                :value="item" />
            </el-select>
          </div>

          <div class="col-start-11 col-end-11">
            <button
              class="flex justify-around items-center bg-primary text-white rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-opacity-50">
              提交
            </button>
          </div>
          <div class="col-start-12 col-end-12">
            <button
              class="flex justify-around items-center bg-white text-black border rounded-lg w-14 p-1.5 text-xs ml-auto mt-5 mb-2 hover:bg-gray"
              @click="closeAddContractDialog"
            >
              取消
            </button>
          </div>

        </div>
      </div>
    </el-dialog>

    <!-- 查看合同详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="合同详情" width="800" align-center class="p-10">
      <div class="rounded-lg px-6 mb-5">

        <!-- 合同内容 -->
        <div class="grid grid-cols-12">
          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">项目名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.projectName }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同类型</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractType }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同编号</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractId }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同名称</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractName }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同性质</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractNature }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">结算方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractPay }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">合同金额(万元)</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractCost }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">预付款</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractPrepaid }}</span><span>%</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">签约日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractSigndate }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">开始日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractStartdate }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">结束日期</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractEnddate }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">签订方式</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractWay }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-xs">甲方单位</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractFirstcompany }}</span>
          </div>

          <div class="col-span-2 bg-slate-100 w-full h-10 flex justify-end items-center px-2 border border-slate-300">
            <span class="text-red">*</span><span class="text-xs">乙方单位</span>
          </div>
          <div class="col-span-4 flex items-center h-10 px-2 border border-slate-300">
            <span class="text-xs">{{ detailData.contractSecondcompany }}</span>
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
        <SearchInput class="text-xs max-w-100" label="合同名称" placeholder="输入合同名称" v-model="searchConditions.name">
        </SearchInput>
        <SearchInput class="text-xs max-w-100" label="合同编号" placeholder="输入合同编号" v-model="searchConditions.id">
        </SearchInput>

        <div class="flex items-center">
          <p class="text-xs ml-3">合同状态</p>
          <el-select v-model="searchConditions.status" class="m-2 max-w-100" placeholder="" style="width: 150px">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <div class="flex items-center">
          <p class="text-xs ml-3">合同性质</p>
          <el-select v-model="searchConditions.nature" class="m-2 max-w-100" placeholder="" style="width: 150px">
            <el-option v-for="item in natureOptions" :key="item" :label="item" :value="item" />
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
        <button @click="addContractDialog()"
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
              <th class="text-xs min-w-[130px] py-1 px-2 font-medium text-black dark:text-white">
                合同编号
              </th>
              <th class="text-xs font-normal min-w-[130px] py-1 px-2 font-medium text-black dark:text-white">
                合同名称
              </th>
              <th class="text-xs min-w-[120px] py-2 px-2 font-medium text-black dark:text-white">
                签约对象
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                合同性质
              </th>
              <th class="text-xs min-w-[90px] py-3 px-2 font-medium text-black dark:text-white">
                合同类型
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                合同金额
              </th>
              <th class="text-xs min-w-[70px] py-3 px-2 font-medium text-black dark:text-white">
                合同状态
              </th>
              <th class="text-xs min-w-[100px] py-3 px-2 font-medium text-black dark:text-white">
                签订日期
              </th>
              <th class="text-xs min-w-[170px] py-3 px-2 font-medium text-black dark:text-white">
                项目名称
              </th>
              <th class="text-xs min-w-[80px] py-3 px-2 font-medium text-black dark:text-white">
                操作
              </th>
            </tr>
          </thead>

          <!-- 表格内容 -->
          <tbody>
            <tr class="bg-white dark:bg-slate-300 items-center" v-for="(item, index) in tableData" :key="index">
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ (pageInfo.currentPage - 1) * 6 + index + 1 }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-primary hover:underline cursor-pointer" @click="showDetail(item)">
                  {{ item.contractId }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractName }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractFirstcompany }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractNature }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractType }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractCost }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractState }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.contractSigndate }}</p>
              </td>
              <td class="text-center py-2 px-2">
                <p class="text-xs text-black">{{ item.projectName }}</p>
              </td>
              <td class="flex-between text-center py-2 px-2">
                <button
                  @click="editContractDialog(item)"
                  class="flex justify-around items-center bg-primary text-white rounded-lg w-14 p-1.5 text-xs m-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 448 512">
                    <path fill="#ffffff"
                      d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                  </svg>
                  审核
                </button>
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
      <Pagination @pageChange="handlePageChange" :pageCount="pageInfo.totalPages" :total="pageInfo.totalCount"
        :currentPage="pageInfo.currentPage"></Pagination>
    </div>
  </DefaultLayout>
</template>
